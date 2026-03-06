const express = require("express");
const router = express.Router();
const { body } = require("express-validator")
const TransactionController = require("../controller/TransactionController")
const middleware = require("../middleware/middleware")

router.post("/add-transaction", middleware.protect, [
    body("type").notEmpty().withMessage("Type is required").isIn(["income", "expense"]).withMessage("Type must be income or expense"),
    body("amount").notEmpty().withMessage("Amount is required").isNumeric().withMessage("Amount must be a number"),

    body("category").notEmpty().withMessage("Category is required"),

   body("date").optional().isISO8601().withMessage("Invalid date format")

],TransactionController.addTransaction);

router.get("/transaction",middleware.protect,TransactionController.getAllTransactions);
router.get("/dashboard", middleware.protect, TransactionController.getDashboard);

module.exports=router;