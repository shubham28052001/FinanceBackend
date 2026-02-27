const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")

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
    refreshToken: {
      type: String,
      select: false
    },
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


module.exports = mongoose.model("User", userSchema);
