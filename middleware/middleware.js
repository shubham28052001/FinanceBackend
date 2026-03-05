const jwt = require("jsonwebtoken")
const UserModel = require("../models/user")

exports.protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization?.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                message: "Not authorized, token missing",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY);
        const user = await UserModel.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                message: "User not found",
            });
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
}




exports.adminOnly = async (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "Admin access only",
        });
    }
    next();
}