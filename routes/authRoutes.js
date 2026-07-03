const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
    sendOTP,
    verifyOTP,
    acceptTerms,
    getProfile,
    logout,
} = require("../controllers/authController");

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.put("/accept-terms", auth, acceptTerms);

router.get("/profile", auth, getProfile);
router.post("/logout", auth, logout);

module.exports = router;
