const { validationResult } = require("express-validator");
const budgetmodel = require("../models/budgetmodel")
const transactionModel = require("../models/transactionmodel")
const mongoose = require("mongoose")

exports.createBudget = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }
        const { category, limit, type } = req.body;

        const existingBudget = await budgetmodel.findOne({
            user: req.user.id,
            category: {
                $regex: new RegExp("^" + category + "$", "i")
            },
            type
        });
        if (existingBudget) {
            return res.status(400).json({
                success: false,
                message: "Budget already exists for this category"
            });
        }

        const expense = await transactionModel.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(req.user.id),
                    type: "expense",
                    category: {
                        $regex: new RegExp("^" + category + "$", "i")
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" }
                }
            }
        ]);

        const spent = expense[0]?.total || 0;

        let usage = 0;
        if (limit > 0) {
            usage = (spent / limit) * 100;
        }
        let status = "safe";

        if (usage > 90) {
            status = "danger";
        }
        else if (usage > 70) {
            status = "warning";
        }

        const budget = await budgetmodel.create({
            user: req.user.id,
            category: category.toLowerCase(),
            limit,
            type
        });

        res.status(201).json({
            success: true,
            message: "Budget created succesfully",
            budget,
            spent,
            usage: Math.round(usage),
            status
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.getAllBudgets = async (req, res) => {
    try {
        const budgets = await budgetmodel.find({
            user: req.user.id
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            message: "Budget Fetched succesfully",
            budgets
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }

}

exports.deleteBudget = async (req, res) => {
    try {

        const budget = await budgetmodel.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!budget) {
            return res.status(404).json({
                success: false,
                message: "Budget not found"
            });
        }

        await budgetmodel.deleteOne({
            _id: req.params.id
        });

        res.json({
            success: true,
            message: "Budget deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}