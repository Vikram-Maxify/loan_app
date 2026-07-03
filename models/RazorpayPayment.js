const mongoose = require("mongoose");

const razorpayPaymentSchema = new mongoose.Schema(
  {
    // Logged In User
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Loan Application
    loanApplication: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LoanApplication",
      required: true,
    },

    applicationId: {
      type: String,
      required: true,
    },

    // Razorpay Order
    razorpayOrderId: {
      type: String,
      required: true,
    },

    // Razorpay Payment
    razorpayPaymentId: {
      type: String,
      default: null,
    },

    razorpaySignature: {
      type: String,
      default: null,
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "INR",
    },

    paymentFor: {
      type: String,
      default: "Loan Processing Fee",
    },

    paymentMethod: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "created",
        "success",
        "failed",
      ],
      default: "created",
    },

    failureReason: {
      type: String,
      default: "",
    },

    paidAt: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "RazorpayPayment",
  razorpayPaymentSchema
);