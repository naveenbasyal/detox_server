const mongoose = require("mongoose");

const dailyEntrySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    // i want to share the user also
    content: { type: String, required: true },
    mood: { type: String, required: true },
    visibility: { type: String, required: true },
    
  },
  { timestamps: true }
);

const DailyEntry = mongoose.model("DailyEntry", dailyEntrySchema);
module.exports = DailyEntry;
