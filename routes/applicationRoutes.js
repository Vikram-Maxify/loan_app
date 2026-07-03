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

// Create Application
router.post("/create", auth, createApplication);

// Accept Terms
router.put("/:applicationId/accept-terms", auth, acceptTerms);

// Update Account Details
router.put("/:applicationId/account-details", auth, updateAccountDetails);

// Get Logged In User Applications
router.get("/my-applications", auth, getApplicationsByUserId);

// Get All Applications (Admin)
router.get("/", auth, getAllApplications);

// Get Application By ID
router.get("/:id", auth, getApplicationById);

module.exports = router;