const AmountSetting = require("../models/amountSettingModel");

/* ===========================
   GET AMOUNT
=========================== */
exports.getAmount = async (req, res) => {
  try {
    let setting = await AmountSetting.findOne();

    // Create default document if not exists
    if (!setting) {
      setting = await AmountSetting.create({
        amount: 259,
      });
    }

    return res.status(200).json({
      success: true,
      amount: setting.amount,
    });
  } catch (error) {
    console.error("Get Amount Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===========================
   UPDATE AMOUNT (ADMIN)
=========================== */
exports.updateAmount = async (req, res) => {
  try {
    const { amount } = req.body;

    if (amount === undefined || amount === null || amount < 0) {
      return res.status(400).json({
        success: false,
        message: "Valid amount is required",
      });
    }

    let setting = await AmountSetting.findOne();

    if (!setting) {
      setting = await AmountSetting.create({
        amount,
      });
    } else {
      setting.amount = amount;
      await setting.save();
    }

    return res.status(200).json({
      success: true,
      message: "Amount updated successfully",
      data: setting,
    });
  } catch (error) {
    console.error("Update Amount Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};