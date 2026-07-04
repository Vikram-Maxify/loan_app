require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const path = require("path");

const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

connectDB();

const app = express();

app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://ownpocket.live",
      "https://www.ownpocket.live",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes.js"));
app.use("/api/admin/loans", require("./routes/adminLoanRoutes"));
app.use("/api/loan", require("./routes/loanRoutes"));
app.use("/api/razorpay", require("./routes/razorpayRoutes"));
app.use("/api/application", require("./routes/applicationRoutes"));
app.use("/api/payment", require("./routes/qrRoute.js"));
app.use('/api', require("./routes/upiroutes"))
app.use("/api/amount-setting", require("./routes/amountSettingRoute.js"));
app.use("/api/orders", require("./routes/orderRoute.js"));


// React Build
const clientPath = path.join(__dirname, "Client", "dist");

const bcrypt = require("bcryptjs");

async function generatePassword() {
  const password = "admin123";
  const hash = await bcrypt.hash(password, 10);

  console.log("Password:", password);
  console.log("Hash:", hash);
}

generatePassword();

app.use(express.static(clientPath));



app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});