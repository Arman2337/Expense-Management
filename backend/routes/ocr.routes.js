const controller = require("../controllers/ocr.controller");
const router = require("express").Router();

// Test OCR service
router.get("/test", controller.testOCR);

// Process receipt with OCR
router.post("/process-receipt", controller.uploadMiddleware, controller.processReceipt);

module.exports = router;