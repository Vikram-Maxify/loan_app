const QRCode = require("qrcode");
const UpiSettings = require("../models/upiSettingsModel"); 

/* ======================
   GENERATE UPI QR (USER DEPOSIT)
====================== */
exports.generateUserDepositUpiQR = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid amount required",
      });
    }

    const upiSettings = await UpiSettings.findOne().sort({ createdAt: -1 });

    if (!upiSettings) {
      return res.status(404).json({
        success: false,
        message: "UPI settings not found",
      });
    }

    const upiId = upiSettings.upiId;
    const payeeName = upiSettings.upiName;

    // Unique Transaction ID
    const txnId = `DEP_${req.user.id}_${Date.now()}`;

    const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
      payeeName
    )}&am=${amount}&cu=INR&tn=${encodeURIComponent(
      `User Deposit | ${txnId}`
    )}`;

    const qrImage = await QRCode.toDataURL(upiLink, {
      errorCorrectionLevel: "H",
      margin: 2,
      scale: 8,
    });

    return res.status(200).json({
      success: true,
      amount,
      transactionId: txnId,
      upiId,
      payeeName,
      upiLink,
      qrImage,
    });
  } catch (err) {
    console.error("Generate UPI QR Error:", err);

    return res.status(500).json({
      success: false,
      message: "QR generation failed",
    });
  }
};