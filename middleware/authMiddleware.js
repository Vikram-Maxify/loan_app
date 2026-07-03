const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
    try {
        let token;

        // 1. Cookie Token
        if (req.cookies?.token) {
            token = req.cookies.token;
        }

        // 2. Bearer Token
        else if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer ")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized. No token provided.",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get latest user from database
        const user = await User.findById(decoded.id).select("-otp -otpExpire");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found.",
            });
        }

        req.user = user;

        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token.",
        });
    }
};