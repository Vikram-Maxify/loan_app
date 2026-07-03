const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
    {
        // ================= Personal Details =================

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        fullName: {
            type: String,
            required: true,
            trim: true,
        },

        mobileNumber: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },

        aadhaarNumber: {
            type: String,
            required: true,
            trim: true,
        },

        panNumber: {
            type: String,
            required: true,
            trim: true,
            uppercase: true,
        },

        purpose: {
            type: String,
            required: true,
            trim: true,
        },

        // ================= Purpose of Loan =================
        forPurposeOfLoan: {
            type: String,
            enum: [
                "Business Expansion",
                "Working Capital",
                "Machinery Purchase",
                "Inventory Purchase",
                "Shop / Office Setup",
                "Other",
            ],
            required: true,
        },

        // ================= Relative / Reference =================
        relativesReferenceContact: {
            relationship: {
                type: String,
                required: true,
                trim: true,
            },

            relativesName: {
                type: String,
                required: true,
                trim: true,
            },

            mobileNumber: {
                type: String,
                required: true,
                trim: true,
            },
        },

        // ================= Employment =================
        whatDoYouDo: {
            type: String,
            enum: [
                "Self Employed",
                "Employed (Private)",
                "Government Employed",
                "Not Employed",
            ],
            required: true,
        },

        // ================= Terms =================
        termsAccepted: {
            type: Boolean,
            required: true,
            default: false,
        },

        // ================= Account Details =================
        accountDetails: {
            accountHolderName: {
                type: String,
                trim: true,
            },

            bankName: {
                type: String,
                trim: true,
            },

            accountNumber: {
                type: String,
                trim: true,
            },

            confirmAccountNumber: {
                type: String,
                trim: true,
            },

            ifscCode: {
                type: String,
                uppercase: true,
                trim: true,
            },

            accountType: {
                type: String,
                enum: ["Savings", "Current"],
            },

            cancelledChequeOrPassbook: {
                type: String, // Image/File URL
            },
        },
    },
    {
        timestamps: true,
    }
);

module.exports =
  mongoose.models.Application ||
  mongoose.model("Application", applicationSchema);