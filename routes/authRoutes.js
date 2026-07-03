const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
    sendOTP,
    verifyOTP,
    completeProfile,
    acceptTerms,
    getProfile,
} = require("../controllers/authController");

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

router.put("/complete-profile", auth, completeProfile);
router.put("/accept-terms", auth, acceptTerms);

router.get("/profile", auth, getProfile);

module.exports = router;