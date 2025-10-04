const multer = require('multer');
const path = require('path');

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save files to the 'uploads' directory
    },
    filename: (req, file, cb) => {
        // Create a unique filename to avoid overwriting files
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Configure multer with the storage settings
const upload = multer({ storage: storage });

module.exports = upload;