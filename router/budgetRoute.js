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
        .custom(value => value > 0)
        .withMessage("Limit must be greater than 0"),

    body("type")
        .isIn(["weekly", "monthly", "yearly"])
        .withMessage("Type must be weekly, monthly or yearly")
], bugdetController.createBudget);

router.get(
    "/all-budgets",
    middleware.protect,
    bugdetController.getAllBudgets
);
router.delete(
    "/delete-budget/:id",
    middleware.protect,
    bugdetController.deleteBudget
);

module.exports = router;