const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
    createLoanApplication,
    saveStep1,
    saveStep2,
    saveStep3,
    saveStep4,
    saveStep5,
    submitApplication,
    getMyApplications,
    getApplicationById,
    deleteApplication,
} = require("../controllers/loanController");

// Create Loan Draft
router.post("/create", auth, createLoanApplication);

// Save Step 1
router.put("/step1", auth, saveStep1);

router.put("/step2", auth, saveStep2);

router.put("/step3", auth, saveStep3);

router.put("/step4", auth, saveStep4);

router.put("/step5", auth, saveStep5);

router.put("/submit", auth, submitApplication);

router.get("/my-applications", auth, getMyApplications);

router.get("/:id", auth, getApplicationById);

router.delete("/:id", auth, deleteApplication);

module.exports = router;