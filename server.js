require("dotenv").config();

const express = require("express");

const cors = require("cors");

const connectDB = require("./config/db");

const cookieParser = require("cookie-parser");


const dns = require("dns");
dns.setServers(['8.8.8.8', '1.1.1.1']);

connectDB();

const app = express();

app.use(cookieParser());


app.use(
    cors({
        origin: "http://localhost:5173", // frontend URL
        credentials: true,
    })
);
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/admin/loans", require("./routes/adminLoanRoutes"));
app.use("/api/loan", require("./routes/loanRoutes"));
app.use("/api/razorpay", require("./routes/razorpayRoutes"));
app.use("/api/application", require("./routes/applicationRoutes"));

app.listen(process.env.PORT, () => {

    console.log(`Server running on ${process.env.PORT}`);

});
