const Order = require("../models/Order");

// Generate Unique Order ID
const generateOrderId = () => {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(1000 + Math.random() * 9000);

  return `ORD${timestamp}${random}`;
};

// Create Order
exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user?.id;

    if (!amount) {
      return res.status(400).json({
        success: false,
        message: "Amount is required",
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Check if user has any pending order
    const existingPendingOrder = await Order.findOne({
      user: userId,
      status: 'pending'
    });

    if (existingPendingOrder) {
      return res.status(409).json({
        success: false,
        message: "You already have a pending order. Complete or cancel it before creating a new one.",
        data: {
          orderId: existingPendingOrder.orderId,
          amount: existingPendingOrder.amount,
          status: existingPendingOrder.status
        }
      });
    }

    // Generate unique orderId
    let orderId;
    let exists = true;

    while (exists) {
      orderId = generateOrderId();
      exists = await Order.findOne({ orderId });
    }

    const order = await Order.create({
      user: userId,
      amount,
      orderId,
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An order already exists for this user.",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "fullName email mobile")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};