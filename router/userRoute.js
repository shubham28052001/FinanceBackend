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

module.exports = router;