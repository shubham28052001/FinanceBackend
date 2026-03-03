const Usermodel = require("../models/user");

exports.getallusers = async (req, res) => {
    try {
        const users = await Usermodel.find().select("-password -refreshToken");
        res.status(200).json({
            success: true,
            message: "Users Fetched Successfully",
            count: users.length,
            users,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message,
        });
    }
}

exports.blockUser = async (req, res) => {
    try {
        const user = await Usermodel.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.role === "admin") {
            return res.status(400).json({
                message: "Cannot block admin"
            });
        }
        user.isBlocked = true;
        await user.save();
        res.status(200).json({
            success: true,
            message: `Account blocked`,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

exports.unblockUser = async (req, res) => {
    try {
        const user = await Usermodel.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.role === "admin") {
            return res.status(400).json({
                message: "Cannot unblock admin (not applicable)"
            });
        }
        user.isBlocked = false;
        await user.save();
        res.status(200).json({
            success: true,
            message: "Account unblocked successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}
