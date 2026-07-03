const express = require("express");

const router = express.Router();

const {
  getAllLoanApplications,
  getLoanApplicationById,
  deleteLoanApplication,
} = require("../controllers/adminLoanController");

const auth = require("../middleware/authMiddleware");
const adminAuth = require("../middleware/adminAuth");

// Get All Loan Applications
router.get("/", auth, adminAuth, getAllLoanApplications);

// Get Loan By ID
router.get("/:id", auth, adminAuth, getLoanApplicationById);

// Delete Loan
router.delete("/:id", auth, adminAuth, deleteLoanApplication);

module.exports = router;