const express = require("express");
const router = express.Router();
const authController = require("../controller/userController");
const { body } = require("express-validator")
const middleware=require("../middleware/middleware")

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

router.put("/reset-password/:token",[
    body("password").isLength({ min: 6 }).withMessage("Password too short")
], authController.resetPassword
);
router.post("/forgot-password",[
    body("email").isEmail().withMessage("Invalid email")
], authController.forgotPassword
);
router.put("/change-password",[
    body("oldpassword").notEmpty().withMessage("Old password is required"),
    body("newpassword").isLength({ min: 6 }).withMessage("New password too short")
], authController.changedPassword
);

module.exports = router;
