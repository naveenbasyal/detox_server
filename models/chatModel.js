const mongoose = require("mongoose");

// Define a schema for chat messages
const chatMessageSchema = new mongoose.Schema({
  message: String,
  username: String,
  userImage: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference the User model
  },
  timestamp: { type: Date, default: Date.now },
});

const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);

module.exports = ChatMessage;
