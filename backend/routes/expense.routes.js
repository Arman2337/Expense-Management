const controller = require("../controllers/expense.controller");
const { checkAuth, checkManager } = require("../middleware/auth.middleware");
const router = require("express").Router();
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/receipts/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'receipt-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only .png, .jpg, .jpeg and .pdf files are allowed!'));
    }
  }
});

// All expense routes require a user to be logged in
router.use(checkAuth);

// Submit expense with optional file upload
router.post("/", upload.single('receipt'), controller.submitExpense);

router.get("/my-expenses", controller.getMyExpenses);

// Only Managers or Admins can see pending approvals
router.get("/pending-approvals", checkManager, controller.getPendingApprovals);

module.exports = router;