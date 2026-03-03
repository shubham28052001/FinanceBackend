
const express = require("express");
const router = express.Router();
const authController = require("../controller/adminController");
const { body } = require("express-validator")
const middleware = require("../middleware/middleware")

router.get("/users", middleware.protect, middleware.adminOnly, authController.getallusers)

module.exports=router;