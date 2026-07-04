const express = require("express");
const router = express.Router();

const {
  getUpiDetails,
  updateUpiDetails,
} = require("../controllers/adminUpiController");

const auth = require("../middleware/authMiddleware");
const adminAuth = require("../middleware/adminAuth");

// User Route
router.get("/upi", auth, getUpiDetails);

// Admin Route
router.put("/admin/upi", adminAuth, updateUpiDetails);

module.exports = router;