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

exports.login = async (req,res) =>{
    try{
        const{email,password} = req.body;
        if(!email || !password){
        return res.staus(400).json({
            success:false,
            message:"Email and password is required"
        })
    }
    const user = await Usermodel.findOne({ email }).select("+password");

    if(!user){
        return res.status(401).json({
            success:false,
            message:"Invalid email or password"
        })
    }
      // ✅ Email verification check
    // if (!user.isEmailVerified) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Please verify your email before login"
    //   });
    // }
    const isMatch = await user.matchPassword(password);
    if(!isMatch){
        return res.status(401).json({
            success:false,
            message:"invalid email or password"
        })
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
        success:true,
        message:"Login Successfully",
        role: user.role,
        accessToken,
        refreshToken
    })

    }catch(error){
        console.log(error);
        res.status(500).json({message:error.message});
    }

// }
// exports.verifyEmail = async (req, res) => {
//   const { token } = req.query;

//   const decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY);

//   const user = await Usermodel.findById(decoded.id);

//   user.isEmailVerified = true;
//   await user.save();

//   res.json({ message: "Email verified successfully" });
// };


// exports.resendVerificationEmail = async (req, res) => {
//   try {
//     res.status(200).json({
//       success: true,
//       message: "Resend verification route working"
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
};