const Razorpay = require("razorpay");
const crypto = require("crypto");

const RazorpayPayment = require("../models/RazorpayPayment");
const Application = require("../models/Application");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// =========================
// Create Payment
// =========================
exports.createPayment = async (req, res) => {
    console.log("Create Payment Hit");
    try {
        const { applicationId, amount } = req.body;

        console.log("Request Body:", req.body);
        console.log("User ID:", req.user.id);

        const application = await Application.findOne({
            applicationId: applicationId,
            user: req.user.id,
        });

        console.log("Application Found:", application);

        const allApplications = await Application.find().select(
            "_id applicationId user"
        );

        console.log("All Applications:", allApplications);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found",
            });
        }

        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: application._id.toString(),
        };

        const order = await razorpay.orders.create(options);

        const payment = await RazorpayPayment.create({
            user: req.user.id,
            application: application._id,
            applicationId: application._id.toString(),
            razorpayOrderId: order.id,
            amount,
            status: "created",
        });

        res.status(201).json({
            success: true,
            key: process.env.RAZORPAY_KEY_ID,
            order,
            payment,
        });
    } catch (err) {
        console.error("Create Payment Error:", err);
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// =========================
// Verify Payment
// =========================
exports.verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        const sign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (sign !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Payment Verification Failed",
            });
        }

        const payment = await RazorpayPayment.findOneAndUpdate(
            {
                razorpayOrderId: razorpay_order_id,
            },
            {
                razorpayPaymentId: razorpay_payment_id,
                razorpaySignature: razorpay_signature,
                status: "success",
                paidAt: new Date(),
            },
            {
                new: true,
            }
        );

        res.status(200).json({
            success: true,
            payment,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};


exports.paymentFailed = async (req, res) => {

    try {

        const {
            razorpay_order_id,
            reason,
        } = req.body;

        const payment =
            await RazorpayPayment.findOneAndUpdate(
                {
                    razorpayOrderId:
                        razorpay_order_id,
                },
                {
                    status: "failed",
                    failureReason: reason,
                },
                {
                    new: true,
                }
            );

        res.json({
            success: true,
            payment,
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message,
        });

    }

};

// =========================
// Get All Payments
// =========================
exports.getAllPayments = async (req, res) => {
    try {
        const payments = await RazorpayPayment.find()
            .populate("user", "fullName mobile")
            .populate("application")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            total: payments.length,
            payments,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// =========================
// Get Payment By Id
// =========================
exports.getPaymentById = async (req, res) => {
    try {
        const payment = await RazorpayPayment.findById(req.params.id)
            .populate("user", "fullName mobile")
            .populate("application");

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found",
            });
        }

        res.status(200).json({
            success: true,
            payment,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// =========================
// Get Orders By User Id
// =========================
exports.getOrdersByUserId = async (req, res) => {
    try {
        const userId = req.user.id;

        const payments = await RazorpayPayment.find({
            user: userId,
        })
            .populate("application")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            total: payments.length,
            payments,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};