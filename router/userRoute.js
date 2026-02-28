const express = require("express");
const router = express.Router();
const authController = require("../controller/userController");
const { body } = require("express-validator")

router.post("/register",
    [
        body("name").isLength({ min: 3 }).withMessage("Name too short"),
        body("email").isEmail().withMessage("Invalid email"),
        body("password").isLength({ min: 6 }).withMessage("password too short")
    ],
    authController.register);


router.post("/login",[
    body("email").isEmail().withMessage("Invalid Email"),
    body("password").notEmpty().withMessage("Password is required")
],
authController.login);

router.get("/verify-email",authController.verifyEmail);
router.post("/resend-verification", authController.resendVerificationEmail);

<<<<<<< HEAD
=======

>>>>>>> 86cd78050d43f2ebfb44223f27480d0ea876df2c
module.exports = router;