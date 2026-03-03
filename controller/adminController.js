const Usermodel = require("../models/user");

exports.getallusers = async (req, res) => {
    try {
        const users = await Usermodel.find().select("-password -refreshToken");
        res.status(200).json({
            success: true,
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
