const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// ================= SEND OTP =================

exports.sendOTP = async (req, res) => {
    try {
        const { mobile, fullName, email } = req.body;

        if (!mobile) {
            return res.status(400).json({
                success: false,
                message: "Mobile number is required",
            });
        }

        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Check existing user
        let user = await User.findOne({ mobile });

        if (user) {
            // Existing User -> Login
            user.otp = otp;
            user.otpExpire = new Date(Date.now() + 5 * 60 * 1000);

            // Update only if empty
            if (!user.fullName && fullName) {
                user.fullName = fullName;
            }

            if (!user.email && email) {
                user.email = email;
            }

            await user.save();
        } else {
            // New User -> Register
            user = await User.create({
                mobile,
                fullName,
                email,
                otp,
                otpExpire: new Date(Date.now() + 5 * 60 * 1000),
                role: "user",
                isVerified: false,
            });
        }

        // TODO: Send OTP via SMS Provider
        console.log("OTP:", otp);

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            otp
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// ================= VERIFY OTP =================

exports.verifyOTP = async (req, res) => {
    try {
        const { mobile, otp } = req.body;

        if (!mobile || !otp) {
            return res.status(400).json({
                success: false,
                message: "Mobile and OTP are required",
            });
        }

        const user = await User.findOne({ mobile });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (!user.otp) {
            return res.status(400).json({
                success: false,
                message: "Please request a new OTP",
            });
        }

        if (user.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        if (!user.otpExpire || user.otpExpire < new Date()) {
            return res.status(400).json({
                success: false,
                message: "OTP expired",
            });
        }

        // Verify User
        user.isVerified = true;
        user.otp = null;
        user.otpExpire = null;

        await user.save();

        // Generate JWT
        const token = generateToken({
            id: user._id,
            role: user.role,
        });

        // Set Cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // Get Updated User
        const userData = await User.findById(user._id).select(
            "-otp -otpExpire"
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: userData,
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// ================= COMPLETE PROFILE =================



// ================= ACCEPT TERMS =================

exports.acceptTerms = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                termsAccepted: true,
            },
            {
                new: true,
            }
        ).select("-otp -otpExpire");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Terms accepted successfully",
            user,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// ================= GET PROFILE =================

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-otp -otpExpire");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            user,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// ================= LOGOUT =================

exports.logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};