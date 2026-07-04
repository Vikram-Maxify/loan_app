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

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpire = new Date(Date.now() + 5 * 60 * 1000);

        // ==========================
        // 1. Check by Mobile
        // ==========================
        let user = await User.findOne({ mobile });

        if (user) {
            // If email is being changed, make sure it doesn't belong to another user
            if (
                email &&
                email !== user.email
            ) {
                const emailExists = await User.findOne({
                    email,
                    _id: { $ne: user._id },
                });

                if (emailExists) {
                    return res.status(400).json({
                        success: false,
                        message: "Email is already registered with another account.",
                    });
                }

                user.email = email;
            }

            if (fullName) {
                user.fullName = fullName;
            }

            user.otp = otp;
            user.otpExpire = otpExpire;

            await user.save();

            console.log("OTP:", otp);

            return res.status(200).json({
                success: true,
                message: "OTP sent successfully",
                otp, // Remove in production
            });
        }

        // ==========================
        // 2. New User -> Check Email
        // ==========================
        if (email) {
            const emailExists = await User.findOne({ email });

            if (emailExists) {
                return res.status(400).json({
                    success: false,
                    message: "Email is already registered.",
                });
            }
        }

        // ==========================
        // 3. Create New User
        // ==========================
        user = await User.create({
            mobile,
            fullName,
            email,
            otp,
            otpExpire,
            role: "user",
            isVerified: false,
        });

        console.log("OTP:", otp);

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            otp, // Remove in production
        });

    } catch (err) {
        console.error(err);

        // Mongo Duplicate Error
        if (err.code === 11000) {
            const field = Object.keys(err.keyPattern)[0];

            return res.status(400).json({
                success: false,
                message: `${field} already exists.`,
            });
        }

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