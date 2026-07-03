const Razorpay = require("razorpay");
const crypto = require("crypto");

const RazorpayPayment = require("../models/RazorpayPayment");
const LoanApplication = require("../models/LoanApplication");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createPayment = async (req, res) => {
    try {

        const { applicationId, amount } = req.body;

        const loan = await LoanApplication.findOne({
            applicationId,
            user: req.user.id,
        });

        if (!loan) {
            return res.status(404).json({
                success: false,
                message: "Loan Application not found",
            });
        }

        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: applicationId,
        };

        const order = await razorpay.orders.create(options);

        const payment = await RazorpayPayment.create({
            user: req.user.id,
            loanApplication: loan._id,
            applicationId,
            razorpayOrderId: order.id,
            amount,
            status: "created",
        });

        res.status(201).json({
            success: true,
            order,
            payment,
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message,
        });

    }
};

exports.verifyPayment = async (req, res) => {

    try {

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        const sign = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(
                razorpay_order_id +
                "|" +
                razorpay_payment_id
            )
            .digest("hex");

        if (sign !== razorpay_signature) {

            return res.status(400).json({
                success: false,
                message: "Payment Verification Failed",
            });

        }

        const payment =
            await RazorpayPayment.findOneAndUpdate(
                {
                    razorpayOrderId: razorpay_order_id,
                },
                {
                    razorpayPaymentId:
                        razorpay_payment_id,

                    razorpaySignature:
                        razorpay_signature,

                    status: "success",

                    paidAt: new Date(),
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

exports.getAllPayments = async (req, res) => {

    try {

        const payments =
            await RazorpayPayment.find()
                .populate(
                    "user",
                    "fullName mobile"
                )
                .populate(
                    "loanApplication"
                )
                .sort({
                    createdAt: -1,
                });

        res.json({
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

exports.getPaymentById = async (req, res) => {

    try {

        const payment =
            await RazorpayPayment.findById(
                req.params.id
            )
                .populate(
                    "user",
                    "fullName mobile"
                )
                .populate(
                    "loanApplication"
                );

        if (!payment) {

            return res.status(404).json({
                success: false,
                message: "Payment not found",
            });

        }

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