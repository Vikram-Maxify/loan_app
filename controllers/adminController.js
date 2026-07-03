const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

exports.adminLogin = async (req, res) => {
  try {
    const { mobile, password } = req.body;

    if (!mobile || !password) {
      return res.status(400).json({
        success: false,
        message: "Mobile and password are required",
      });
    }

    const admin = await User.findOne({
      mobile,
      role: "admin",
    }).select("+password");

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid mobile or password",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid mobile or password",
      });
    }

    const token = generateToken({
      id: admin._id,
      role: admin.role,
    });

    admin.password = undefined;

    res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      admin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Get Admin Profile
// ===============================
exports.getProfile = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id).select("-otp -otpExpire");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      admin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Get All Users
// ===============================
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      total: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Logout
// ===============================
exports.logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Admin logged out successfully",
  });
};