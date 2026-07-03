const LoanApplication = require("../models/LoanApplication");

// ==============================
// Get All Loan Applications
// ==============================
exports.getAllLoanApplications = async (req, res) => {
  try {
    const loans = await LoanApplication.find()
      .populate("user", "fullName mobile role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: loans.length,
      loans,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get Loan Application By ID
// ==============================
exports.getLoanApplicationById = async (req, res) => {
  try {
    const { id } = req.params;

    const loan = await LoanApplication.findById(id).populate(
      "user",
      "fullName mobile role"
    );

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: "Loan application not found",
      });
    }

    res.status(200).json({
      success: true,
      loan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Delete Loan Application
// ==============================
exports.deleteLoanApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const loan = await LoanApplication.findById(id);

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: "Loan application not found",
      });
    }

    await LoanApplication.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Loan application deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};