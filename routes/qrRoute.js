const express = require("express");
const router = express.Router();

const {
  generateUserDepositUpiQR,
} = require("../controllers/generateUserDepositUpiQR"); // apna correct controller path

const auth = require("../middleware/authMiddleware");


// Generate UPI QR for User Deposit
router.post(
  "/generate-user-deposit-upi-qr",
  auth,
  generateUserDepositUpiQR
);

module.exports = router;