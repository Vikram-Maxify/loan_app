const express = require("express");

const router = express.Router();

const auth = require("../middlewares/auth");

const {
    createPayment,
    verifyPayment,
    paymentFailed,
    getAllPayments,
    getPaymentById,
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

module.exports = router;