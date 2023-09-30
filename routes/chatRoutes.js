const express = require("express");
const router = express.Router();


const { getAllChats } = require("../controllers/chatController");
const verifyToken = require("../middlewares/verifyToken");

router.get("/messages", getAllChats);

module.exports = router;
