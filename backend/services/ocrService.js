const tesseract = require('tesseract.js');
const path = require('path');

// Dummy OCR service for demonstration
exports.processReceipt = async (filePath) => {
    // In a real implementation, you would use tesseract.recognize(filePath, ...)
    // Here, we simulate a successful OCR result
    return {
        success: true,
        extractedText: 'Sample extracted text from receipt',
        expenseData: {
            description: 'Lunch with client',
            amount: '120.50',
            category: 'Meals & Entertainment',
            expenseDate: '2025-10-04',
            remarks: 'OCR auto-filled'
        },
        confidence: 92
    };
};
