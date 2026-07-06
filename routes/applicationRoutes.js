const express = require("express");
const router = express.Router();

const {
  createApplication,
  acceptTerms,
  updateAccountDetails,
  getAllApplications,
  getApplicationById,
  getApplicationsByUserId,
} = require("../controllers/applicationController");

const auth = require("../middleware/authMiddleware");
const adminAuth = require("../middleware/adminAuth");

// User Routes
router.post("/create", auth, createApplication);

router.put("/:applicationId/accept-terms", auth, acceptTerms);

router.put("/:applicationId/account-details", auth, updateAccountDetails);

router.get("/my-applications", auth, getApplicationsByUserId);

// Admin Routes
router.get("/", adminAuth, getAllApplications);

router.get("/:id", adminAuth, getApplicationById);

module.exports = router;