const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// ================= SEND OTP =================

exports.sendOTP = async (req, res) => {
    try {
        const { mobile } = req.body;

        if (!mobile) {
            return res.status(400).json({
                success: false,
                message: "Mobile number is required",
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        let user = await User.findOne({ mobile });

        if (!user) {
            user = await User.create({
                mobile,
                otp,
                otpExpire: new Date(Date.now() + 5 * 60 * 1000),
                role: "user",
            });
        } else {
            user.otp = otp;
            user.otpExpire = new Date(Date.now() + 5 * 60 * 1000);
            await user.save();
        }

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            otp, // Remove in production
        });
    } catch (err) {
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

        if (user.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        if (!user.otpExpire || user.otpExpire < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "OTP expired",
            });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpire = undefined;

        await user.save();

        const token = generateToken({
            id: user._id,
            role: user.role,
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        const userData = await User.findById(user._id).select("-otp -otpExpire");

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully",
            token,
            user: userData,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// ================= COMPLETE PROFILE =================

exports.completeProfile = async (req, res) => {
    try {
        const { fullName, fatherName, motherName } = req.body;

        if (!fullName || !fatherName || !motherName) {
            return res.status(400).json({
                success: false,
                message: "Full name, father name and mother name are required",
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                fullName,
                fatherName,
                motherName,
                profileCompleted: true,
            },
            {
                new: true,
                runValidators: true,
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
            message: "Profile completed successfully",
            user,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

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