const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");
const jwt = require("jsonwebtoken");
// nodemailer
const nodemailer = require("nodemailer");
const DailyEntry = require("../models/dailyEntriesModel");
const ChatMessage = require("../models/chatModel");

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

    // verifying the user's email
    const verificationToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    const link = `${process.env.CLIENT_URL}/verify/${user._id}/${verificationToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: "egqlnqvpjhgpejhq",
      },
    });
    const mailOptions = {
      from: "DeToxify.me",
      to: email,
      subject: "Email Verification",
      html: `<h3>Please click on the given link to verify your email</h3>

      <a href=${link}>Verify Email Here</a>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: "Error sending email" });
      } else {
        console.log("Email sent: " + info.response);
        return res.status(200).json({
          message:
            "Verification link has been sent to your email, Please verify it.",
        });
      }
    });

    await user.save();
    // res.status(201).json({
    //   message: "User created successfully",
    //   user: user,
    //   token: generateToken(user._id, user.email),
    // });
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
    // __________ Verify Email ----------
    if (!user.verified) {
      const verificationToken = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "1h",
        }
      );

      const link = `${process.env.CLIENT_URL}/verify/${user._id}/${verificationToken}`;

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.ADMIN_EMAIL,
          pass: "egqlnqvpjhgpejhq",
        },
      });
      const mailOptions = {
        from: "DeToxify.me",
        to: email,
        subject: "Email Verification",
        html: `<h3>Please click on the given link to verify your email</h3>
  
        <a href=${link}>Verify Email Here</a>
        `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.status(500).json({ message: "Error sending email" });
        } else {
          console.log("Email sent: " + info.response);
          return res.status(200).json({
            message:
              "Verification link has been sent to your email, Please verify it.",
          });
        }
      });
    }
    if (user.verified) {
      return res.status(200).json({
        message: "User logged in successfully",
        user: user,
        token: generateToken(user._id, user.email),
      });
    }
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

    // Update the user's profile picture
    const user = await User.findByIdAndUpdate(
      id,
      { username, picture },
      { new: true }
    );

    // Update all chat messages with the matching userId
    await ChatMessage.updateMany(
      { userId: userId },
      { username, userImage: picture }
    );

    console.log("user", user);
    return res
      .status(200)
      .json({ message: "Profile updated successfully", user: user });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};


// forgotpassword
const forgotpassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found ,please register." });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "30m",
    });

    const link = `${process.env.CLIENT_URL}/resetpassword/${user._id}/${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: "egqlnqvpjhgpejhq",
      },
    });
    const mailOptions = {
      from: "DeToxify.me",
      to: email,
      subject: "Reset Password Link",
      html: `<h2 style="color: red;">Important: Do not share this link with anyone else.</h2><h3>Please click on the given link to reset your password</h3>
      
      <a href=${link}>Click Here</a> 
      <br/>
      <strong style="color:red;">This Link will expire in 30 minutes</strong>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: "Error sending email" });
      } else {
        console.log("Email sent: " + info.response);
        return res
          .status(200)
          .json({ message: "Reset password link has been sent to your email" });
      }
    });

    return res
      .status(200)
      .json({ message: "Reset password link has been sent to your email" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// Reset Password
const resetpassword = async (req, res) => {
  const { password: newPassword } = req.body;

  const { id, token } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    if (hashedPassword) {
      await User.findByIdAndUpdate(
        { _id: id },
        { password: hashedPassword },
        { new: true }
      );

      return res.status(200).json({ message: "Password updated successfully" });
    }
    return res.status(500).json({ message: "Password could not be changed" });
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
// Delete User
const deleteUser = async (req, res) => {
  const { id } = req?.body;
  console.log("deete", id);
  try {
    const user = await User.findById(id);
    // delete all the entries of user
    await DailyEntry.deleteMany({ userId: id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await User.findByIdAndDelete(id, {
      new: true,
    });

    return res.status(200).json({ message: "User Deleted Succesfully", user });
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const verifyUser = async (req, res) => {
  const { id, token } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }
    user.verified = true;
    await user.save();

    return res
      .status(200)
      .json({ message: "Email verification successful", status: 200 });
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
  forgotpassword,
  resetpassword,
  deleteUser,
  verifyUser,
};
