const ChatMessage = require("../models/chatModel");

const getAllChats = async (req, res) => {
  try {
    const messages = await ChatMessage.find().sort({ timestamp: 1 });
    return res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    return res.status(500).json({ error: "Unable to fetch chat messages" });
  }
};

module.exports = {
  getAllChats,
};
