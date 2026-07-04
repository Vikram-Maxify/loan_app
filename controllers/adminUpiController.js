const UpiSettings = require("../models/upiSettingsModel");

// ==============================
// Get UPI Details
// ==============================
exports.getUpiDetails = async (req, res) => {
  try {
    const upi = await UpiSettings.findOne().sort({ createdAt: -1 });

    if (!upi) {
      return res.status(404).json({
        success: false,
        message: "UPI details not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: upi,
    });
  } catch (error) {
    console.error("Get UPI Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Create / Update UPI
// ==============================
exports.updateUpiDetails = async (req, res) => {
  try {
    const body = req.body || {};

    const upiId = body.upiId?.trim();
    const upiName = (body.upiName || body.payeeName)?.trim();

    if (!upiId || !upiName) {
      return res.status(400).json({
        success: false,
        message: "UPI ID and Payee Name are required",
      });
    }

    let upi = await UpiSettings.findOne();

    if (upi) {
      upi.upiId = upiId;
      upi.upiName = upiName;
      await upi.save();
    } else {
      upi = await UpiSettings.create({
        upiId,
        upiName,
      });
    }

    return res.status(200).json({
      success: true,
      message: "UPI details saved successfully",
      data: upi,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};