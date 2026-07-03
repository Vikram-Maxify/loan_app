const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    // ================= User =================
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ================= Personal Details =================
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

    employmentDetails: {
      // ========== Self Employed ==========
      selfEmployed: {
        businessType: {
          type: String,
          trim: true,
        },

        businessName: {
          type: String,
          trim: true,
        },

        yearsInBusiness: {
          type: Number,
          min: 0,
        },

        annualTurnover: {
          type: Number,
          min: 0,
        },
      },

      // ========== Private Employee ==========
      privateEmployee: {
        companyName: {
          type: String,
          trim: true,
        },

        designation: {
          type: String,
          trim: true,
        },

        department: {
          type: String,
          trim: true,
        },

        yearsOfExperience: {
          type: Number,
          min: 0,
        },

        monthlySalary: {
          type: Number,
          min: 0,
        },
      },

      // ========== Government Employee ==========
      governmentEmployee: {
        organizationName: {
          type: String,
          trim: true,
        },

        designation: {
          type: String,
          trim: true,
        },

        department: {
          type: String,
          trim: true,
        },

        yearsOfService: {
          type: Number,
          min: 0,
        },

        payScale: {
          type: String,
          trim: true,
        },
      },

      // ========== Not Employed ==========
      notEmployed: {
        currentStatus: {
          type: String,
          trim: true,
        },

        sourceOfIncome: {
          type: String,
          trim: true,
        },

        monthlyIncome: {
          type: Number,
          min: 0,
        },

        futureEmploymentPlans: {
          type: String,
          trim: true,
        },
      },
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
        trim: true,
        uppercase: true,
      },

      accountType: {
        type: String,
        enum: ["Savings", "Current"],
      },

      cancelledChequeOrPassbook: {
        type: String, // File/Image URL
      },
    },

    // ================= Terms =================
    termsAccepted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// ================= Employment Validation =================
applicationSchema.pre("save", function (next) {
  switch (this.whatDoYouDo) {
    case "Self Employed":
      if (
        !this.employmentDetails?.selfEmployed?.businessType ||
        !this.employmentDetails?.selfEmployed?.businessName ||
        this.employmentDetails?.selfEmployed?.yearsInBusiness === undefined ||
        this.employmentDetails?.selfEmployed?.annualTurnover === undefined
      ) {
        return next(
          new Error("Please fill all Self Employed details.")
        );
      }
      break;

    case "Employed (Private)":
      if (
        !this.employmentDetails?.privateEmployee?.companyName ||
        !this.employmentDetails?.privateEmployee?.designation ||
        !this.employmentDetails?.privateEmployee?.department ||
        this.employmentDetails?.privateEmployee?.yearsOfExperience ===
          undefined ||
        this.employmentDetails?.privateEmployee?.monthlySalary === undefined
      ) {
        return next(
          new Error("Please fill all Private Employee details.")
        );
      }
      break;

    case "Government Employed":
      if (
        !this.employmentDetails?.governmentEmployee?.organizationName ||
        !this.employmentDetails?.governmentEmployee?.designation ||
        !this.employmentDetails?.governmentEmployee?.department ||
        this.employmentDetails?.governmentEmployee?.yearsOfService ===
          undefined ||
        !this.employmentDetails?.governmentEmployee?.payScale
      ) {
        return next(
          new Error("Please fill all Government Employee details.")
        );
      }
      break;

    case "Not Employed":
      if (
        !this.employmentDetails?.notEmployed?.currentStatus ||
        !this.employmentDetails?.notEmployed?.sourceOfIncome ||
        this.employmentDetails?.notEmployed?.monthlyIncome === undefined ||
        !this.employmentDetails?.notEmployed?.futureEmploymentPlans
      ) {
        return next(
          new Error("Please fill all Not Employed details.")
        );
      }
      break;
  }

  next();
});

module.exports =
  mongoose.models.Application ||
  mongoose.model("Application", applicationSchema);