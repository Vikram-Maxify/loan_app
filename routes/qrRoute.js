const express = require("express");
const router = express.Router();

const {
  generateUserDepositUpiQR,
  verifyUpiId,
} = require("../controllers/generateUserDepositUpiQR"); // apna correct controller path

const auth = require("../middleware/authMiddleware");


// Generate UPI QR for User Deposit
router.post(
  "/generate-user-deposit-upi-qr",
  auth,
  generateUserDepositUpiQR
);

router.post(
  "/generate-upi-qr",
  auth,
  generateUserDepositUpiQR
);

router.post(
  "/verify-upi-id",
  auth,
  verifyUpiId
);

module.exports = router;
