const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    mobile: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    fullName: {
      type: String,
      trim: true,
    },

    fatherName: {
      type: String,
      trim: true,
    },

    motherName: {
      type: String,
      trim: true,
    },

    termsAccepted: {
      type: Boolean,
      default: false,
    },

    otp: {
      type: String,
    },

    otpExpire: {
      type: Date,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    profileCompleted: {
      type: Boolean,
      default: false,
    },

    // Role
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);