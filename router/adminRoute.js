
const express = require("express");
const router = express.Router();
const authController = require("../controller/adminController");
const middleware = require("../middleware/middleware")

router.get("/users", middleware.protect, middleware.adminOnly, authController.getallusers)
router.put("/block/:id", middleware.protect, middleware.adminOnly, authController.blockUser);

module.exports=router;