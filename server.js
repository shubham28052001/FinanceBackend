require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const userRoute=require("./router/userRoute")
const adminRoute=require("./router/adminRoute")
const PORT = process.env.PORT || 5000;
const app = express();

connectDB();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("API Running...");
});

app.use("/api/users/",userRoute);
app.use("/api/admin/",adminRoute);

app.listen(PORT, () => {
     console.log(`Server running at: http://localhost:${PORT}`);
});

