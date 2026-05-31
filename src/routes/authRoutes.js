const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getMe,
  logout,
  updateMe,
} = require("../controllers/authController");

// middleware (auth protect লাগবে)
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../config/multer"); // multer থাকলে

// ======================
// Public Routes
// ======================
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logout);

// ======================
// Protected Routes
// ======================
router.get("/me", protect, getMe);
router.put("/me", protect, upload.single("image"), updateMe);

module.exports = router;
