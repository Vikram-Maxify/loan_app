const express = require("express");
const router = express.Router();

const { createOrder, getAllOrders } = require("../controllers/orderController");
const auth = require("../middleware/authMiddleware");

router.post("/create", auth, createOrder);
router.get("/", auth, getAllOrders);


module.exports = router;