const express = require("express");

const router = express.Router();

const {
  adminLogin,
  getProfile,
  getAllUsers,
  logout,
} = require("../controllers/adminController");

const auth = require("../middleware/authMiddleware");
const adminAuth = require("../middleware/adminAuth");

// Public
router.post("/login", adminLogin);

// Protected
router.get("/profile", auth, adminAuth, getProfile);

router.get("/users", auth, adminAuth, getAllUsers);

router.post("/logout", auth, adminAuth, logout);

module.exports = router;