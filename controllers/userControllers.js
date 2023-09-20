const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");
const jwt = require("jsonwebtoken");
//registeration

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const isExist = await User.findOne({ email });
    if (isExist) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });

    await user.save();
    res.status(201).json({
      message: "User created successfully",
      user: user,
      token: generateToken(user._id, user.email),
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
// Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exists" });
    }
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    return res.status(200).json({
      message: "User logged in successfully",
      user: user,
      token: generateToken(user._id, user.email),
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

//getAllUsers
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ points: -1 });
    return res.status(200).json({ users });
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById({ _id: id });
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
//updateProfile
const updateUserById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { username, picture } = req.body;

  try {
    // user not found
    const userExist = await User.findById(id);
    if (!userExist) {
      return res.status(404).json({ message: "User not found" });
    }
    if (userId !== id) {
      return res  
        .status(401)
        .json({ message: "You are not authorized to update this profile" });
    }
    const user = await User.findByIdAndUpdate(
      id,
      { username, picture },
      { new: true }
    );
    console.log("user", user);
    return res
      .status(200)
      .json({ message: "Profile updated successfully", user: user });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUserById,
};
