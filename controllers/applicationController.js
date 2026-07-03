const Application = require("../models/Application");

// ==============================
// Create Application
// ==============================
exports.createApplication = async (req, res) => {
    try {
        const user = req.user.id;

        const {
            fullName,
            mobileNumber,
            email,
            aadhaarNumber,
            panNumber,
            purpose,
            forPurposeOfLoan,
            relativesReferenceContact,
            whatDoYouDo,
        } = req.body;

        // Validation
        if (
            !fullName ||
            !mobileNumber ||
            !email ||
            !aadhaarNumber ||
            !panNumber ||
            !purpose ||
            !forPurposeOfLoan ||
            !relativesReferenceContact ||
            !whatDoYouDo
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
        }

        const application = await Application.create({
            user,
            fullName,
            mobileNumber,
            email,
            aadhaarNumber,
            panNumber,
            purpose,
            forPurposeOfLoan,
            relativesReferenceContact,
            whatDoYouDo,
        });

        return res.status(201).json({
            success: true,
            message: "Application submitted successfully.",
            data: application,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong.",
            error: error.message,
        });
    }
};


exports.acceptTerms = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const user = req.user.id;
        const { termsAccepted } = req.body;

        if (termsAccepted === undefined) {
            return res.status(400).json({
                success: false,
                message: "termsAccepted is required.",
            });
        }

        const application = await Application.findOneAndUpdate(
            {
                _id: applicationId,
                user,
            },
            {
                termsAccepted,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Terms accepted updated successfully.",
            data: application,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ==============================
// Step 3 - Update Account Details
// ==============================
exports.updateAccountDetails = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const user = req.user.id;

        const {
            accountHolderName,
            bankName,
            accountNumber,
            confirmAccountNumber,
            ifscCode,
            accountType,
            cancelledChequeOrPassbook,
        } = req.body;

        if (
            accountNumber &&
            confirmAccountNumber &&
            accountNumber !== confirmAccountNumber
        ) {
            return res.status(400).json({
                success: false,
                message: "Account number and Confirm Account Number do not match.",
            });
        }

        const application = await Application.findOneAndUpdate(
            {
                _id: applicationId,
                user,
            },
            {
                accountDetails: {
                    accountHolderName,
                    bankName,
                    accountNumber,
                    confirmAccountNumber,
                    ifscCode,
                    accountType,
                    cancelledChequeOrPassbook,
                },
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Account details updated successfully.",
            data: application,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ===============================
// Get All Applications
// ===============================
exports.getAllApplications = async (req, res) => {
    try {
        const applications = await Application.find().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: applications.length,
            data: applications,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch applications",
            error: error.message,
        });
    }
};

// ===============================
// Get Application By ID
// ===============================
exports.getApplicationById = async (req, res) => {
    try {
        const { id } = req.params;

        const application = await Application.findById(id);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: application,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch application",
            error: error.message,
        });
    }
};

// ===============================
// Get Logged In User Applications
// ===============================
exports.getApplicationsByUserId = async (req, res) => {
    try {
        const userId = req.user.id;

        const applications = await Application.find({ user: userId }).sort({
            createdAt: -1,
        });

        return res.status(200).json({
            success: true,
            count: applications.length,
            data: applications,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user applications",
            error: error.message,
        });
    }
};