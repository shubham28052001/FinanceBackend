require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const userRoute = require("./router/userRoute")
const adminRoute = require("./router/adminRoute")
const transactionRoute = require("./router/TransactionRoute")
const budgetRoute = require("./router/budgetRoute")
const cors = require("cors");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 5000;
const app = express();

connectDB();

app.use(cors({
    origin: [
        process.env.CLIENT_URL,
        "finance-frontend-ten-iota.vercel.app"
    ],
    credentials: true
}));
app.use(cookieParser());


app.use(express.json());

app.get("/", (req, res) => {
    res.send("API Running...");
});

app.use("/api/users/", userRoute);
app.use("/api/admin/", adminRoute);
app.use("/api/transaction/", transactionRoute);
app.use("/api/budget/", budgetRoute);;

app.listen(PORT, () => {
    console.log(`Server running at: http://localhost:${PORT}`);
});

