const express = require("express");
const router = express.Router();

const {
  getAmount,
  updateAmount,
} = require("../controllers/amountSettingController");

const auth = require("../middleware/authMiddleware");
const adminAuth = require("../middleware/adminAuth");



// Public
router.get("/",auth, getAmount);

// Admin
router.put("/update-amount", auth, updateAmount);

module.exports = router;