const transactionModel = require("../models/transactionmodel")
const { validationResult } = require("express-validator");
const mongoose = require("mongoose")

exports.addTransaction = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const { type, amount, category, description, date } = req.body;

    if (type === "expense") {
      const income = await transactionModel.aggregate([
        {
          $match: { user: new mongoose.Types.ObjectId(req.user.id), type: "income" }
        },
        {
          $group: { _id: null, total: { $sum: "$amount" } }
        }
      ]);
      const expense = await transactionModel.aggregate([
        {
          $match: { user: new mongoose.Types.ObjectId(req.user.id), type: "expense" }
        },
        {
          $group: { _id: null, total: { $sum: "$amount" } }
        }
      ]);
      const totalIncome = income[0]?.total || 0;
      const totalExpense = expense[0]?.total || 0;
      const balance = totalIncome - totalExpense;
      if (type === "expense" && amount > balance) {
        return res.status(400).json({
          success: false,
          message: "⚠ Low balance warning"
        });
      }
    }

    const transaction = await transactionModel.create({
      user: req.user.id,
      type,
      amount,
      category,
      description,
      date
    });
    res.status(201).json({
      success: true,
      transaction,
      message: "Transaction added successfully"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

exports.getDashboard = async (req, res) => {
  try {

    const income = await transactionModel.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.id),
          type: "income"
        }
      },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: "$amount" }
        }
      }
    ]);

    const expense = await transactionModel.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.id),
          type: "expense"
        }
      },
      {
        $group: {
          _id: null,
          totalExpense: { $sum: "$amount" }
        }
      }
    ]);

    const totalIncome = income[0]?.totalIncome || 0;
    const totalExpense = expense[0]?.totalExpense || 0;

    const balance = totalIncome - totalExpense;

    res.json({
      success: true,
      totalIncome,
      totalExpense,
      balance
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await transactionModel
      .find({ user: req.user.id })
      .sort({ createdAt: -1 }); // Latest first

    res.json({
      success: true,
      message: "Transaction Fetched Successfully",
      transactions
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await transactionModel.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found"
      });
    }

    await transactionModel.deleteOne({
      _id: req.params.id
    });

    res.json({
      success: true,
      message: "Transaction deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}