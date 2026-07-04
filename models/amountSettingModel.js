const mongoose = require("mongoose");

const amountSettingSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      default: 259,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AmountSetting", amountSettingSchema);