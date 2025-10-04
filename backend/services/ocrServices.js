const Tesseract = require('tesseract.js');
const path = require('path');

class OCRService {
    constructor() {
        this.expensePatterns = {
            // Common amount patterns
            amount: [
                /total[:\s]*\$?([\d,]+\.?\d*)/i,
                /amount[:\s]*\$?([\d,]+\.?\d*)/i,
                /sum[:\s]*\$?([\d,]+\.?\d*)/i,
                /\$\s*([\d,]+\.?\d+)/g,
                /(?:^|\s)([\d,]+\.?\d{2})(?:\s|$)/g, // General amount pattern
                /(?:total|amount|sum).*?([\d,]+\.?\d+)/i
            ],
            
            // Date patterns
            date: [
                /(\d{1,2}\/\d{1,2}\/\d{2,4})/g,
                /(\d{1,2}-\d{1,2}-\d{2,4})/g,
                /(\d{4}-\d{1,2}-\d{1,2})/g,
                /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2}[,\s]+\d{2,4}/i,
                /\d{1,2}\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{2,4}/i
            ],
            
            // Merchant/vendor patterns
            merchant: [
                /^[A-Z][A-Z\s&.'-]+$/m, // Company names (all caps lines)
                /(?:restaurant|hotel|store|shop|market|cafe|coffee|gas|station|pharmacy|grocery)/i
            ],
            
            // Category keywords
            categories: {
                'Meals & Entertainment': ['restaurant', 'cafe', 'coffee', 'bar', 'food', 'dining', 'lunch', 'dinner', 'breakfast'],
                'Travel': ['hotel', 'airline', 'taxi', 'uber', 'lyft', 'gas', 'fuel', 'parking', 'rental'],
                'Office Supplies': ['office', 'supplies', 'staples', 'depot', 'paper', 'pen', 'printer'],
                'Software & Subscriptions': ['software', 'subscription', 'saas', 'cloud', 'license'],
                'Professional Development': ['training', 'course', 'education', 'seminar', 'workshop', 'conference'],
                'Client Meeting': ['meeting', 'conference', 'client', 'presentation'],
                'Transportation': ['transport', 'bus', 'train', 'metro', 'subway'],
                'Accommodation': ['hotel', 'motel', 'lodging', 'stay', 'accommodation'],
                'Equipment': ['equipment', 'laptop', 'phone', 'device', 'hardware'],
                'Medical': ['medical', 'doctor', 'pharmacy', 'hospital', 'clinic'],
                'Other': []
            }
        };
    }

    async processReceipt(imagePath) {
        try {
            console.log('Processing receipt with OCR:', imagePath);
            
            // Perform OCR on the image
            const { data: { text } } = await Tesseract.recognize(imagePath, 'eng', {
                logger: m => console.log(m) // Log OCR progress
            });

            console.log('OCR Text extracted:', text);

            // Extract expense data from the text
            const expenseData = this.extractExpenseData(text);
            
            console.log('Extracted expense data:', expenseData);
            
            return {
                success: true,
                extractedText: text,
                expenseData,
                confidence: this.calculateConfidence(expenseData)
            };
        } catch (error) {
            console.error('OCR processing error:', error);
            return {
                success: false,
                error: error.message,
                extractedText: null,
                expenseData: null
            };
        }
    }

    extractExpenseData(text) {
        const data = {
            amount: null,
            date: null,
            merchant: null,
            category: null,
            description: null
        };

        // Clean the text
        const cleanText = text.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
        const lines = text.split('\n').filter(line => line.trim().length > 0);

        // Extract amount
        data.amount = this.extractAmount(cleanText);

        // Extract date
        data.date = this.extractDate(cleanText);

        // Extract merchant
        data.merchant = this.extractMerchant(lines);

        // Extract category
        data.category = this.extractCategory(cleanText);

        // Generate description
        data.description = this.generateDescription(data.merchant, data.category, cleanText);

        return data;
    }

    extractAmount(text) {
        for (const pattern of this.expensePatterns.amount) {
            const match = text.match(pattern);
            if (match) {
                // Get the amount value, clean it up
                let amount = match[1] || match[0];
                amount = amount.replace(/[$,]/g, '').trim();
                
                // Validate it's a reasonable amount
                const numAmount = parseFloat(amount);
                if (numAmount > 0 && numAmount < 100000) { // Reasonable range
                    return numAmount.toString();
                }
            }
        }
        return null;
    }

    extractDate(text) {
        for (const pattern of this.expensePatterns.date) {
            const match = text.match(pattern);
            if (match) {
                try {
                    const dateStr = match[0];
                    const date = new Date(dateStr);
                    if (!isNaN(date.getTime()) && date.getFullYear() > 2020 && date.getFullYear() <= new Date().getFullYear() + 1) {
                        return date.toISOString().split('T')[0]; // Return YYYY-MM-DD format
                    }
                } catch (error) {
                    continue;
                }
            }
        }
        return null;
    }

    extractMerchant(lines) {
        // Usually the first few lines contain the merchant name
        for (let i = 0; i < Math.min(5, lines.length); i++) {
            const line = lines[i].trim();
            if (line.length > 3 && line.length < 50) {
                // Check if it looks like a business name
                if (/^[A-Z\s&.''-]+$/.test(line) || /^[A-Z][a-zA-Z\s&.''-]+$/.test(line)) {
                    return line;
                }
            }
        }
        return null;
    }

    extractCategory(text) {
        const lowerText = text.toLowerCase();
        
        for (const [category, keywords] of Object.entries(this.expensePatterns.categories)) {
            if (category === 'Other') continue; // Skip 'Other' category for now
            
            for (const keyword of keywords) {
                if (lowerText.includes(keyword)) {
                    return category;
                }
            }
        }
        
        return 'Other'; // Default category
    }

    generateDescription(merchant, category, text) {
        if (merchant) {
            return `Expense at ${merchant}`;
        }
        
        if (category && category !== 'Other') {
            return `${category} expense`;
        }

        // Try to find a descriptive line
        const lines = text.split('\n').filter(line => line.trim().length > 5 && line.trim().length < 100);
        if (lines.length > 0) {
            return lines[0].trim();
        }

        return 'Expense from receipt';
    }

    calculateConfidence(expenseData) {
        let confidence = 0;
        let totalFields = 0;

        // Check each field and assign confidence
        if (expenseData.amount) {
            confidence += 0.4; // Amount is most important
        }
        totalFields++;

        if (expenseData.date) {
            confidence += 0.3; // Date is very important
        }
        totalFields++;

        if (expenseData.merchant) {
            confidence += 0.2; // Merchant is helpful
        }
        totalFields++;

        if (expenseData.category && expenseData.category !== 'Other') {
            confidence += 0.1; // Category is nice to have
        }
        totalFields++;

        return Math.round((confidence / totalFields) * 100);
    }

    // Helper method to clean up extracted text
    cleanExtractedText(text) {
        return text
            .replace(/[^\w\s$.,\-\/]/g, '') // Remove special characters except common ones
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim();
    }
}

module.exports = new OCRService();