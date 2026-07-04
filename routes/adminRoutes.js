const express = require("express");

const router = express.Router();

const {
  adminLogin,
  getProfile,
  getAllUsers,
  logout,
  adminRegister,
} = require("../controllers/adminController");

const auth = require("../middleware/authMiddleware");
const adminAuth = require("../middleware/adminAuth");

// Public
router.post("/login", adminLogin);

// Protected
router.get("/profile", auth, adminAuth, getProfile);

router.post("/register", adminRegister);


router.get("/users", auth, getAllUsers);

router.post("/logout", auth, adminAuth, logout);

module.exports = router;