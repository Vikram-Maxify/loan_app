const express = require("express");

const router = express.Router();

const {
  adminLogin,
  getProfile,
  getAllUsers,
  logout,
  adminRegister,
} = require("../controllers/adminController");

const adminAuth = require("../middleware/adminAuth");

// Public
router.post("/login", adminLogin);

// Register (agar public rakhna hai)
router.post("/register", adminRegister);

// Protected Admin Routes
router.get("/profile", adminAuth, getProfile);

router.get("/users", adminAuth, getAllUsers);

router.post("/logout", adminAuth, logout);

module.exports = router;