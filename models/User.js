const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    mobile: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      select: false,
    },

    fullName: {
      type: String,
      trim: true,
    },


    termsAccepted: {
      type: Boolean,
      default: false,
    },

    otp: String,

    otpExpire: Date,

    isVerified: {
      type: Boolean,
      default: false,
    },


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