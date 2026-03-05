const Usermodel = require("../models/user");
const crypto = require("crypto");
const sendEmail = require("../nodemailer/sendMail");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({success:false, message: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    const existingUser = await Usermodel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "USER Already Exist",
      });
    }
    const hashedPassword = await Usermodel.hashPassword(password);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");
    const user = await Usermodel.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
      emailVerificationToken: hashedToken,
      emailVerificationExpire: Date.now() + 5 * 60 * 1000,
    });

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save();

    const verifyLink = `${process.env.CLIENT_URL}/api/users/verify-email?token=${verificationToken}`;

    await sendEmail(
      email,
      "verify your Email",
      `<div style="font-family: Arial, sans-serif; padding:20px;">
             <h2>Verify Your Email</h2>
             <p>Click below to verify</p>
             <a href="${verifyLink}" style="display:inline-block;
         padding:12px 20px;
         background:#2563eb;
         color:white;
         text-decoration:none;
         border-radius:6px;
         font-weight:bold;">Verify Email</a>
      </div>`
    );

    res.status(201).json({
      success: true,
      message: "Verification email sent",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password is required",
      });
    }
    const user = await Usermodel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before login",
      });
    }
    if (user.isBlocked) {

      if (user.blockExpiresAt && user.blockExpiresAt < Date.now()) {
        user.isBlocked = false;
        user.blockExpiresAt = null;
        await user.save();
      } else {
        return res.status(403).json({
          success: false,
          message: "Your account is temporarily blocked. Try again later."
        });
      }
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "invalid email or password",
      });
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      success: true,
      message: "Login Successfully",
      role: user.role,
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ message: "Token missing" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await Usermodel.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;
    await user.save();

    res.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

exports.resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Usermodel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    if (user.isEmailVerified) {
      return res.status(400).json({
        message: "Email already verified",
      });
    }
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpire = Date.now() + 5 * 60 * 1000;

    await user.save();

    const verifyLink = `${process.env.CLIENT_URL}/api/users/verify-email?token=${verificationToken}`;

    await sendEmail(
      email,
      "Resend Email Verification",
      `<h2>Verify Your Email</h2>
           <p>Click below to verify</p>
           <a href="${verifyLink}">Verify Email</a>`,
    );

    res.json({
      success: true,
      message: "Verification email resent",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try{
    const {email} = req.body;
    const user = await Usermodel.findOne({email});
    if(!user){
      return res.status(404).json({
        message: "User not found"
      });
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
     const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    await sendEmail(
      email,
      "Password Reset Request",
      `<h2>Password Reset</h2>
       <p>Click below to reset your password</p>
       <a href="${resetLink}">Reset Password</a>`,
    );
    res.json({
      success: true,
      message: "Password reset email sent", 
    });
  }catch(error){
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
}

exports.resetPassword = async (req,res) =>{
  try{
    const {password} = req.body;

    if(!password || password.length < 6){
      return res.status(400).json({
        message: "Password must be at least 6 characters"
      });
    }
    const user = await Usermodel.findOne({
      resetPasswordToken: crypto.createHash("sha256").update(req.params.token).digest("hex"),
      resetPasswordExpire: { $gt: Date.now() }
    });

  if(!user){
    return res.status(400).json({
      message: "Invalid or expired token"
    });
  }
  user.password = await Usermodel.hashPassword(req.body.password);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  res.json({
    success: true,
    message: "Password reset successful"
  });
}catch(error){
  console.log(error);
  res.status(500).json({
    message: error.message
  });
}
};

exports.changedPassword = async (req, res) => {
  try{
    const {oldpassword, newpassword} = req.body;

    if(!oldpassword || !newpassword){
      return res.status(400).json({
        message: "Old password and new password are required"
      });

    }

    const user = await Usermodel.findById(req.user._id).select("+password");
    const isMatch = await user.matchPassword(oldpassword);

    if(!isMatch){
      return res.status(401).json({
        message: "Old password is incorrect"
      });
    }
    user.password = await Usermodel.hashPassword(newpassword);
    await user.save();
    res.json({
      success: true,
      message: "Password changed successfully"
    });
  }catch(error){
    console.log(error);
    res.status(500).json({
      message: error.message
    });
  }
}
