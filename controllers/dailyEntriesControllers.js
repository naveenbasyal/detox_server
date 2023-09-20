const DailyEntry = require("../models/dailyEntriesModel");
const User = require("../models/userModel");

const createDailyEntry = async (req, res) => {
  const { mood, content, visibility } = req.body;
  const userId = req.user.id;
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const todayDate = new Date().toISOString().slice(0, 10);
    const lastEntryDate = new Date(user.lastEntryDate)
      .toISOString()
      .slice(0, 10);
    // Points Checking
    if (lastEntryDate != todayDate) {
      user.level === 1
        ? (user.points += 5)
        : user.level === 2
        ? (user.points += 10)
        : user.level === 3
        ? (user.points += 15)
        : (user.points += 20);
      user.lastEntryDate = todayDate;

      await user.save();
    }

    // Level Checking
    user.points <= 15
      ? (user.level = 1)
      : user.points > 15 && user.points <= 30
      ? (user.level = 2)
      : user.points > 30 && user.points <= 50
      ? (user.level = 3)
      : user.points > 50 && user.points <= 100 && (user.level = 4);

    await user.save();

    // New Entry or Post
    const newEntry = new DailyEntry({
      userId: userId,
      mood,
      content,
      visibility,
    });
    await newEntry.save();
    console.log(newEntry);
    return res
      .status(201)
      .json({ message: "Entry created successfully", entry: newEntry });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
// Get all entries of the user
const getAllEntries = async (req, res) => {
  const userId = req.user.id;
  try {
    const entries = await DailyEntry.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).json({ entries });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
// Get all entries of the users who have public visibility to entries
const getAllPublicEntries = async (req, res) => {
  try {
    const entries = await DailyEntry.find({ visibility: "public" })
      .populate("userId")
      .sort({
        createdAt: -1,
      });
    return res.status(200).json({ entry: entries });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
const getEntryById = async (req, res) => {
  const { id } = req.params;
  try {
    const entry = await DailyEntry.findById(id);
    return res.status(200).json({ entry });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
const updateEntryById = async (req, res) => {
  const { id } = req.body;
  const userId = req.user.id; 
  const { mood, content,visibility } = req.body;
  try {
    const entry = await DailyEntry.findById(id);
    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }
    if (entry.userId.toString() !== userId) {
      return res.status(401).json({ message: "Access Denied" });
    }
    const updatedEntry = await DailyEntry.findByIdAndUpdate(
      id,
      { mood, content,visibility },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "Entry updated successfully", entry: updatedEntry });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
const deleteEntryById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const entry = await DailyEntry.findById(id);
    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }
    if (entry.userId.toString() !== userId) {
      return res.status(401).json({ message: "Access Denied" });
    }
    await DailyEntry.findByIdAndDelete(id);
    return res.status(200).json({ message: "Entry deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
// const likeEntryById = async (req, res) => {};

module.exports = {
  createDailyEntry,
  getAllEntries,
  getEntryById,
  updateEntryById,
  deleteEntryById,
  getAllPublicEntries,
};
