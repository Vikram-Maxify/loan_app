const QRCode = require("qrcode");
const UpiSettings = require("../models/upiSettingsModel"); 

/* ======================
   GENERATE UPI QR (USER DEPOSIT)
====================== */
exports.generateUserDepositUpiQR = async (req, res) => {
  try {
    const { amount, orderId } = req.body;

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
    const txnId = orderId || `DEP_${req.user.id}_${Date.now()}`;

    const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
      payeeName
    )}&am=${Number(amount).toFixed(2)}&tn=${encodeURIComponent(txnId)}&cu=INR`;

    const qrImage = await QRCode.toDataURL(upiLink, {
      errorCorrectionLevel: "H",
      margin: 2,
      scale: 8,
    });

    return res.status(200).json({
      success: true,
      amount,
      orderId: txnId,
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

exports.verifyUpiId = async (req, res) => {
  try {
    const { upiId } = req.body;
    const cleanUpiId = String(upiId || "").trim();
    const upiPattern = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z][a-zA-Z0-9.\-_]{2,64}$/;

    if (!cleanUpiId) {
      return res.status(400).json({
        success: false,
        verified: false,
        message: "UPI ID is required",
      });
    }

    if (!upiPattern.test(cleanUpiId)) {
      return res.status(400).json({
        success: false,
        verified: false,
        message: "Invalid UPI ID",
      });
    }

    // Placeholder verification hook. Replace this block with a PSP/bank VPA
    // validation provider when credentials are available.
    return res.status(200).json({
      success: true,
      verified: true,
      upiId: cleanUpiId,
      message: "Verified Successfully",
    });
  } catch (err) {
    console.error("Verify UPI ID Error:", err);

    return res.status(500).json({
      success: false,
      verified: false,
      message: "Verification Failed",
    });
  }
};
