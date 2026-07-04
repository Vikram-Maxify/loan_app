const express = require("express");
const router = express.Router();

const {
  createOrder,
  getAllOrders,
} = require("../controllers/orderController");

const auth = require("../middleware/authMiddleware");
const adminAuth = require("../middleware/adminAuth");

// User Route
router.post("/create", auth, createOrder);

// Admin Route
router.get("/", adminAuth, getAllOrders);

module.exports = router;