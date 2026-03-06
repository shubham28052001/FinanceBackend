const express = require("express");
const router = express.Router();
const AiController = require("../controller/aiController");
const middleware=require("../middleware/middleware")

router.post(
 "/chat",
 middleware.protect,
 AiController.financeChat
);

module.exports=router