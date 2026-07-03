const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
    createPayment,
    verifyPayment,
    paymentFailed,
    getAllPayments,
    getPaymentById,
    getOrdersByUserId,
} = require("../controllers/razorpayController");

router.post(
    "/create",
    auth,
    createPayment
);

router.post(
    "/verify",
    auth,
    verifyPayment
);

router.post(
    "/failed",
    auth,
    paymentFailed
);

router.get(
    "/",
    auth,
    getAllPayments
);

router.get(
    "/:id",
    auth,
    getPaymentById
);

router.get(
    "/my-orders",
    auth,
    getOrdersByUserId
);

module.exports = router;