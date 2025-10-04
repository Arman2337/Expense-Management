const ocrService = require('../services/ocrService');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../uploads/receipts');
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Create unique filename with timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'receipt-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

// Process receipt with OCR
exports.processReceipt = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                message: 'No file uploaded' 
            });
        }

        console.log('Processing receipt file:', req.file.filename);

        // Process the uploaded file with OCR
        const result = await ocrService.processReceipt(req.file.path);

        // Clean up the uploaded file after processing (optional)
        // fs.unlinkSync(req.file.path);

        if (result.success) {
            res.status(200).json({
                success: true,
                message: 'Receipt processed successfully',
                data: {
                    filename: req.file.filename,
                    extractedText: result.extractedText,
                    expenseData: result.expenseData,
                    confidence: result.confidence
                }
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to process receipt',
                error: result.error
            });
        }

    } catch (error) {
        console.error('OCR processing error:', error);
        
        // Clean up file if there was an error
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({
            success: false,
            message: 'Server error during OCR processing',
            error: error.message
        });
    }
};

// Test endpoint to check if OCR service is working
exports.testOCR = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: 'OCR service is running',
            version: '1.0.0',
            supportedFormats: ['jpg', 'jpeg', 'png', 'bmp', 'tiff', 'webp']
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'OCR service error',
            error: error.message
        });
    }
};

// Export the multer upload middleware
exports.uploadMiddleware = upload.single('receipt');