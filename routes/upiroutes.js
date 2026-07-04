const express = require("express");
const router = express.Router();
const {
  getUpiDetails,
  updateUpiDetails,
} = require("../controllers/adminUpiController");
const auth = require("../middleware/authMiddleware");

// Public route (user fetch kare)
router.get("/upi",auth, getUpiDetails);

// Admin route
router.put("/admin/upi", auth, updateUpiDetails);

module.exports = router;