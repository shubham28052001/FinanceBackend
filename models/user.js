const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    emailVerificationToken: {
      type: String,
      select: false
    },

    emailVerificationExpire: {
      type: Date,
      select: false
    },

    refreshToken: {
      type: String,
      select: false
    },

    isEmailVerified: {
      type: Boolean,
      default: false
    },
    isBlocked: {
      type: Boolean,
      default: false
    },
    resetPasswordToken: {
      type: String,
      select: false
    },
    resetPasswordExpire: {
      type: Date,
      select: false
    }
  },
  { timestamps: true }
);

userSchema.statics.hashPassword = async function (password) {
  const salt = await bcrypt.genSalt(12);
  return await bcrypt.hash(password, salt);
};

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_ACCESS_KEY, { expiresIn: "15m" })
}

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_REFRESH_KEY, { expiresIn: "7d" })
}


userSchema.methods.generateResetPasswordToken = function () {

  const resetToken = crypto.randomBytes(32).toString("hex")

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex")

  this.resetPasswordExpire = Date.now() + 1 * 60 * 1000

  return resetToken
}

module.exports = mongoose.model("User", userSchema);
