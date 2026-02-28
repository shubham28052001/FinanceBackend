const Usermodel = require("../models/user")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
        const existingUser = await Usermodel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "USER Already Exist" });
        }
        const hashedPassword = await Usermodel.hashPassword(password)

        const user = await Usermodel.create({
            name,
            email,
            password: hashedPassword
        });

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save();

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            accessToken,
            refreshToken
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}