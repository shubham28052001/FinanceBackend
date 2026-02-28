const express = require("express");
const router = express.Router();
const authController = require("../controller/userController");
const { body } = require("express-validator")

// register api
router.post("/register",
    [
        body("name").isLength({ min: 3 }).withMessage("Name too short"),
        body("email").isEmail().withMessage("Invalid email"),
        body("password").isLength({ min: 6 }).withMessage("password too short")
    ],
    authController.register);

// login api

router.post("/login",[
    body("email").isEmail().withMessage("Invalid Email"),
    body("password").notEmpty().withMessage("Password is required")

],authController.login);

// emailverification
// router.get("/verifyemail",authController.verifyEmail);
// //resend verification
// router.post(
//   "/resendverification",
//   [body("email").isEmail().withMessage("Invalid Email")],
//   authController.resendVerificationEmail
// );

module.exports = router;