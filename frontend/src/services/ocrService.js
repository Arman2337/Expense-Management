import api from './api';

class OCRService {
    // Process receipt image with OCR
    async processReceipt(file) {
        try {
            console.log('OCR Service: Starting receipt processing...');
            console.log('File details:', { name: file.name, size: file.size, type: file.type });
            
            const formData = new FormData();
            formData.append('receipt', file);

            console.log('OCR Service: Making request to /ocr/process-receipt');
            
            const response = await api.post('/ocr/process-receipt', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                // Add timeout for OCR processing
                timeout: 60000 // 60 seconds
            });

            console.log('OCR Service: Received response:', response.status, response.data);
            return response.data;
        } catch (error) {
            console.error('OCR processing failed:', error);
            console.error('Error details:', {
                message: error.message,
                code: error.code,
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                config: {
                    url: error.config?.url,
                    method: error.config?.method,
                    baseURL: error.config?.baseURL
                }
            });
            
            throw {
                success: false,
                message: error.response?.data?.message || 'Failed to process receipt',
                error: error.response?.data?.error || error.message
            };
        }
    }

    // Test OCR service availability
    async testService() {
        try {
            console.log('OCR Service: Testing service availability at /ocr/test');
            const response = await api.get('/ocr/test');
            console.log('OCR Service: Test successful:', response.data);
            return response.data;
        } catch (error) {
            console.error('OCR service test failed:', error);
            console.error('Test error details:', {
                message: error.message,
                code: error.code,
                status: error.response?.status,
                config: {
                    url: error.config?.url,
                    baseURL: error.config?.baseURL
                }
            });
            
            throw {
                success: false,
                message: error.response?.data?.message || 'OCR service unavailable',
                error: error.response?.data?.error || error.message
            };
        }
    }

    // Validate file before processing
    validateFile(file) {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp', 'image/tiff', 'image/webp'];
        const maxSize = 10 * 1024 * 1024; // 10MB

        if (!file) {
            return { valid: false, message: 'No file selected' };
        }

        if (!validTypes.includes(file.type)) {
            return { 
                valid: false, 
                message: 'Invalid file type. Please upload an image file (JPG, PNG, BMP, TIFF, WebP)' 
            };
        }

        if (file.size > maxSize) {
            return { 
                valid: false, 
                message: 'File size too large. Please upload an image smaller than 10MB' 
            };
        }

        return { valid: true };
    }

    // Format extracted expense data for form
    formatExpenseData(ocrResult) {
        if (!ocrResult.success || !ocrResult.data) {
            return null;
        }

        const { expenseData } = ocrResult.data;
        
        return {
            description: expenseData.description || '',
            amount: expenseData.amount || '',
            category: expenseData.category || '',
            expenseDate: expenseData.date || '',
            remarks: expenseData.merchant ? `Merchant: ${expenseData.merchant}` : '',
            ocrConfidence: ocrResult.data.confidence || 0,
            extractedText: ocrResult.data.extractedText || ''
        };
    }
}

export const ocrService = new OCRService();
export default ocrService;