const LoanApplication = require("../models/LoanApplication");

// ================= CONSTANTS =================

const ANNUAL_INTEREST_RATE = 13.8;
const MIN_LOAN_AMOUNT = 1000;
const MAX_LOAN_AMOUNT = 10000000;
const MIN_TENURE_MONTHS = 3;
const MAX_TENURE_MONTHS = 360;

// ================= EMI CALCULATOR =================

const calculateEMI = (principal, annualRate, tenureMonths) => {
    const monthlyRate = annualRate / 12 / 100;

    // Guard against zero interest rate
    if (monthlyRate === 0) {
        return {
            monthlyEMI: Math.round(principal / tenureMonths),
            totalInterest: 0,
            totalPayable: principal,
        };
    }

    const emi =
        (principal *
            monthlyRate *
            Math.pow(1 + monthlyRate, tenureMonths)) /
        (Math.pow(1 + monthlyRate, tenureMonths) - 1);

    const monthlyEMI = Math.round(emi);
    const totalPayable = Math.round(monthlyEMI * tenureMonths);
    const totalInterest = totalPayable - principal;

    return {
        monthlyEMI,
        totalInterest,
        totalPayable,
    };
};

// ================= CREATE LOAN APPLICATION =================

exports.createLoanApplication = async (req, res) => {
    try {
        const existing = await LoanApplication.findOne({
            user: req.user.id,
            status: "draft",
        });

        if (existing) {
            return res.status(200).json({
                success: true,
                message: "Draft application already exists.",
                application: existing,
            });
        }

        const application = await LoanApplication.create({
            user: req.user.id,
            currentStep: 1,
            completionPercentage: 0,
            status: "draft",
        });

        return res.status(201).json({
            success: true,
            message: "Loan application created successfully.",
            application,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= SAVE STEP 1 =================

exports.saveStep1 = async (req, res) => {
    try {
        const {
            fullName,
            fatherName,
            motherName,
            dob,
            gender,
            maritalStatus,
            panNumber,
            aadhaarNumber,
        } = req.body;

        // Validation
        if (
            !fullName ||
            !fatherName ||
            !motherName ||
            !dob ||
            !gender ||
            !maritalStatus ||
            !panNumber ||
            !aadhaarNumber
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields.",
            });
        }

        // PAN Validation
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        if (!panRegex.test(panNumber.toUpperCase())) {
            return res.status(400).json({
                success: false,
                message: "Invalid PAN Number.",
            });
        }

        // Aadhaar Validation
        const aadhaarRegex = /^[2-9]{1}[0-9]{11}$/;
        if (!aadhaarRegex.test(aadhaarNumber)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Aadhaar Number.",
            });
        }

        // Age Validation — using 365.25 to account for leap years
        const age =
            (Date.now() - new Date(dob).getTime()) /
            (1000 * 60 * 60 * 24 * 365.25);

        if (age < 18) {
            return res.status(400).json({
                success: false,
                message: "Applicant must be at least 18 years old.",
            });
        }

        // Find Draft
        const application = await LoanApplication.findOne({
            user: req.user.id,
            status: "draft",
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Draft application not found.",
            });
        }

        // Save Data
        application.personalDetails = {
            fullName,
            fatherName,
            motherName,
            dob,
            gender,
            maritalStatus,
            panNumber: panNumber.toUpperCase(),
            aadhaarNumber,
        };

        application.currentStep = Math.max(application.currentStep, 2);
        application.completionPercentage = 20;

        await application.save();

        return res.status(200).json({
            success: true,
            message: "Step 1 saved successfully.",
            application,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= SAVE STEP 2 =================

exports.saveStep2 = async (req, res) => {
    try {
        const {
            fullAddress,
            landmark,
            accommodationType,
            state,
            city,
            pinCode,
        } = req.body;

        if (
            !fullAddress ||
            !accommodationType ||
            !state ||
            !city ||
            !pinCode
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields.",
            });
        }

        if (!/^[1-9][0-9]{5}$/.test(pinCode)) {
            return res.status(400).json({
                success: false,
                message: "Invalid PIN Code.",
            });
        }

        const application = await LoanApplication.findOne({
            user: req.user.id,
            status: "draft",
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found.",
            });
        }

        application.address = {
            fullAddress,
            landmark,
            accommodationType,
            state,
            city,
            pinCode,
        };

        application.currentStep = Math.max(application.currentStep, 3);
        application.completionPercentage = 40;

        await application.save();

        return res.status(200).json({
            success: true,
            message: "Step 2 saved successfully.",
            application,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= SAVE STEP 3 =================

exports.saveStep3 = async (req, res) => {
    try {
        const {
            employmentType,
            salaried,
            selfEmployed,
            businessOwner,
            freelancer,
            student,
            unemployed,
        } = req.body;

        if (!employmentType) {
            return res.status(400).json({
                success: false,
                message: "Employment Type is required.",
            });
        }

        const application = await LoanApplication.findOne({
            user: req.user.id,
            status: "draft",
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found.",
            });
        }

        application.employment.employmentType = employmentType;

        switch (employmentType) {
            case "Salaried":
                if (!salaried?.companyName || !salaried?.monthlyIncome) {
                    return res.status(400).json({
                        success: false,
                        message: "Company name and monthly income are required.",
                    });
                }
                application.employment.salaried = salaried;
                break;

            case "Self Employed":
                if (
                    !selfEmployed?.professionCategory ||
                    !selfEmployed?.monthlyRevenue
                ) {
                    return res.status(400).json({
                        success: false,
                        message: "Profession and monthly revenue are required.",
                    });
                }
                application.employment.selfEmployed = selfEmployed;
                break;

            case "Business Owner":
                if (
                    !businessOwner?.legalEntityName ||
                    !businessOwner?.monthlyTurnover
                ) {
                    return res.status(400).json({
                        success: false,
                        message: "Business information is required.",
                    });
                }
                application.employment.businessOwner = businessOwner;
                break;

            case "Freelancer":
                if (!freelancer?.monthlyEarnings) {
                    return res.status(400).json({
                        success: false,
                        message: "Monthly earnings required.",
                    });
                }
                application.employment.freelancer = freelancer;
                break;

            case "Student":
                if (!student?.institution) {
                    return res.status(400).json({
                        success: false,
                        message: "Institution name required.",
                    });
                }
                application.employment.student = student;
                break;

            case "Unemployed":
                application.employment.unemployed = unemployed;
                break;

            default:
                return res.status(400).json({
                    success: false,
                    message: "Invalid employment type.",
                });
        }

        application.currentStep = Math.max(application.currentStep, 4);
        application.completionPercentage = 60;

        await application.save();

        return res.status(200).json({
            success: true,
            message: "Step 3 saved successfully.",
            application,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= SAVE STEP 4 =================

exports.saveStep4 = async (req, res) => {
    try {
        const {
            familyMember,
            friend,
            loanAmount,
            loanPurpose,
            tenure,
        } = req.body;

        if (
            !familyMember ||
            !friend ||
            !loanAmount ||
            !loanPurpose ||
            !tenure
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields.",
            });
        }

        // Loan amount range validation
        const parsedAmount = Number(loanAmount);
        if (
            isNaN(parsedAmount) ||
            parsedAmount < MIN_LOAN_AMOUNT ||
            parsedAmount > MAX_LOAN_AMOUNT
        ) {
            return res.status(400).json({
                success: false,
                message: `Loan amount must be between ₹${MIN_LOAN_AMOUNT.toLocaleString()} and ₹${MAX_LOAN_AMOUNT.toLocaleString()}.`,
            });
        }

        // Tenure range validation
        const parsedTenure = Number(tenure);
        if (
            isNaN(parsedTenure) ||
            parsedTenure < MIN_TENURE_MONTHS ||
            parsedTenure > MAX_TENURE_MONTHS
        ) {
            return res.status(400).json({
                success: false,
                message: `Tenure must be between ${MIN_TENURE_MONTHS} and ${MAX_TENURE_MONTHS} months.`,
            });
        }

        const application = await LoanApplication.findOne({
            user: req.user.id,
            status: "draft",
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found.",
            });
        }

        application.references = {
            familyMember,
            friend,
        };

        const emiData = calculateEMI(parsedAmount, ANNUAL_INTEREST_RATE, parsedTenure);

        application.loanDetails = {
            amount: parsedAmount,
            purpose: loanPurpose,
            tenure: parsedTenure,
            interestRate: ANNUAL_INTEREST_RATE,
            monthlyEMI: emiData.monthlyEMI,
            totalInterest: emiData.totalInterest,
            totalPayable: emiData.totalPayable,
        };

        application.currentStep = Math.max(application.currentStep, 5);
        application.completionPercentage = 80;

        await application.save();

        return res.status(200).json({
            success: true,
            message: "Step 4 saved successfully.",
            application,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= SAVE STEP 5 =================

exports.saveStep5 = async (req, res) => {
    try {
        const {
            accountHolderName,
            bankName,
            accountNumber,
            ifscCode,
        } = req.body;

        if (
            !accountHolderName ||
            !bankName ||
            !accountNumber ||
            !ifscCode
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all bank details.",
            });
        }

        // IFSC Validation: 4 alpha + '0' + 6 alphanumeric
        const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
        if (!ifscRegex.test(ifscCode.toUpperCase())) {
            return res.status(400).json({
                success: false,
                message: "Invalid IFSC Code. Format: ABCD0123456",
            });
        }

        const application = await LoanApplication.findOne({
            user: req.user.id,
            status: "draft",
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found.",
            });
        }

        application.bankDetails = {
            accountHolderName,
            bankName,
            accountNumber,
            ifscCode: ifscCode.toUpperCase(),
            bankVerified: false,
        };

        application.currentStep = Math.max(application.currentStep, 6);
        application.completionPercentage = 95;

        await application.save();

        return res.status(200).json({
            success: true,
            message: "Step 5 saved successfully.",
            application,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= SUBMIT APPLICATION =================

exports.submitApplication = async (req, res) => {
    try {
        const { termsAccepted, bankDetailsConfirmed } = req.body;

        if (!termsAccepted || !bankDetailsConfirmed) {
            return res.status(400).json({
                success: false,
                message: "Please accept declarations before submitting.",
            });
        }

        const application = await LoanApplication.findOne({
            user: req.user.id,
            status: "draft",
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found.",
            });
        }

        // Validate all required steps are complete
        if (!application.personalDetails?.fullName) {
            return res.status(400).json({
                success: false,
                message: "Step 1 is incomplete.",
            });
        }

        if (!application.address?.fullAddress) {
            return res.status(400).json({
                success: false,
                message: "Step 2 is incomplete.",
            });
        }

        if (!application.employment?.employmentType) {
            return res.status(400).json({
                success: false,
                message: "Step 3 is incomplete.",
            });
        }

        if (!application.loanDetails?.amount) {
            return res.status(400).json({
                success: false,
                message: "Step 4 is incomplete.",
            });
        }

        if (!application.bankDetails?.accountNumber) {
            return res.status(400).json({
                success: false,
                message: "Step 5 is incomplete.",
            });
        }

        application.declarations = {
            termsAccepted,
            bankDetailsConfirmed,
        };

        // Step 7 marks application as fully submitted (beyond step 6 = bank details)
        application.currentStep = 7;
        application.completionPercentage = 100;
        application.status = "submitted";
        application.submittedAt = new Date();

        await application.save();

        return res.status(200).json({
            success: true,
            message: "Loan application submitted successfully.",
            application,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= GET MY APPLICATIONS =================

exports.getMyApplications = async (req, res) => {
    try {
        const applications = await LoanApplication.find({
            user: req.user.id,
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: applications.length,
            applications,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= GET APPLICATION BY ID =================

exports.getApplicationById = async (req, res) => {
    try {
        const application = await LoanApplication.findOne({
            _id: req.params.id,
            user: req.user.id,
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found.",
            });
        }

        return res.status(200).json({
            success: true,
            application,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


exports.deleteApplication = async (req, res) => {
    try {
        const application = await LoanApplication.findOne({
            _id: req.params.id,
            user: req.user.id,
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found.",
            });
        }

        if (application.status !== "draft") {
            return res.status(400).json({
                success: false,
                message: "Only draft applications can be deleted.",
            });
        }

        await application.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Application deleted successfully.",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.calculateEMI = calculateEMI;