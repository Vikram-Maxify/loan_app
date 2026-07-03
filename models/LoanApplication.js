const mongoose = require("mongoose");

const loanApplicationSchema = new mongoose.Schema(
  {
    // Logged in user
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    applicationId: {
      type: String,
      unique: true,
    },

    // ================= STEP 1 =================
    // Personal & Identity
    personalDetails: {
      fullName: String,
      fatherName: String,
      motherName: String,

      dob: Date,

      gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
      },

      maritalStatus: {
        type: String,
        enum: [
          "Single",
          "Married",
          "Divorced",
          "Widowed",
        ],
      },

      panNumber: {
        type: String,
        uppercase: true,
      },

      aadhaarNumber: String,
    },

    // ================= STEP 2 =================
    // Address
    address: {
      fullAddress: String,

      landmark: String,

      accommodationType: {
        type: String,
        enum: [
          "Owned by Self",
          "Owned by Parents",
          "Rented",
          "Company Provided",
        ],
      },

      state: String,

      city: String,

      pinCode: String,
    },

    // ================= STEP 3 =================
    // Employment
    employment: {
      employmentType: {
        type: String,
        enum: [
          "Salaried",
          "Self Employed",
          "Business Owner",
          "Freelancer",
          "Student",
          "Unemployed",
        ],
      },

      // Salaried
      salaried: {
        companyName: String,

        workEmail: String,

        monthlyIncome: Number,

        salaryCreditMode: {
          type: String,
          enum: [
            "Bank Transfer",
            "Cheque",
            "Cash",
          ],
        },

        salaryDateRange: String,

        workExperience: String,
      },

      // Self Employed
      selfEmployed: {
        professionCategory: String,

        monthlyRevenue: Number,

        businessLifespan: String,
      },

      // Business Owner
      businessOwner: {
        legalEntityName: String,

        industry: String,

        monthlyTurnover: Number,

        gstRegistered: Boolean,
      },

      // Freelancer
      freelancer: {
        niches: [String],

        monthlyEarnings: Number,

        payoutMode: String,
      },

      // Student
      student: {
        institution: String,

        degree: String,

        graduationYear: Number,

        emergencyCapitalSource: String,
      },

      // Unemployed
      unemployed: {
        emergencyCapitalSource: String,
      },
    },

    // ================= STEP 4 =================
    // References
    references: {
      familyMember: {
        relationship: String,

        fullName: String,

        mobile: String,
      },

      friend: {
        fullName: String,

        mobile: String,
      },
    },

    // Loan Details
    loanDetails: {
      amount: Number,

      purpose: {
        type: String,
        enum: [
          "Personal",
          "Business",
          "Education",
          "Medical",
          "Travel",
          "Electronics",
          "Other",
        ],
      },

      tenure: Number,

      interestRate: {
        type: Number,
        default: 13.8,
      },

      monthlyEMI: Number,

      totalInterest: Number,

      totalPayable: Number,
    },

    // ================= STEP 5 =================
    // Bank
    bankDetails: {
      accountHolderName: String,

      bankName: String,

      accountNumber: String,

      ifscCode: String,

      bankVerified: {
        type: Boolean,
        default: false,
      },
    },

    // ================= STEP 6 =================
    declarations: {
      termsAccepted: {
        type: Boolean,
        default: false,
      },

      bankDetailsConfirmed: {
        type: Boolean,
        default: false,
      },
    },

    // Progress
    currentStep: {
      type: Number,
      default: 1,
    },

    completionPercentage: {
      type: Number,
      default: 0,
    },

    // Status
    status: {
      type: String,
      enum: [
        "draft",
        "submitted",
        "under_review",
        "approved",
        "rejected",
        "disbursed",
      ],
      default: "draft",
    },

    submittedAt: Date,

    approvedAt: Date,

    rejectedAt: Date,

    disbursedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Generate Application ID
loanApplicationSchema.pre("save", function (next) {
  if (!this.applicationId) {
    this.applicationId =
      "QC" +
      Date.now().toString().slice(-8) +
      Math.floor(Math.random() * 999);
  }

  next();
});

module.exports = mongoose.model(
  "LoanApplication",
  loanApplicationSchema
);