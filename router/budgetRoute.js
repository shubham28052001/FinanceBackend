const express = require("express");
const router = express.Router();
const { body } = require("express-validator")

const bugdetController = require("../controller/budgetController");
const middleware = require("../middleware/middleware")

router.post("/create-budget", middleware.protect, [
body("category")
    .notEmpty()
    .withMessage("Category is required"),

body("limit")
    .notEmpty()
    .withMessage("Limit is required")
    .isNumeric()
    .withMessage("Limit must be a number"),

body("type")
    .isIn(["weekly", "monthly", "yearly"])
    .withMessage("Type must be weekly, monthly or yearly")
],bugdetController.createBudget);


module.exports=router;