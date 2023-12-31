const Challenges = require("../models/challengesModel");
const User = require("../models/userModel");

const createChallenge = async (req, res) => {
  const { title, description, points, enddate } = req.body;
  //   Admin Check
  const Email = req.user.email;
  // if (Email !== process.env.ADMIN_EMAIL) {
  //   return res.status(401).json({ message: "Access Denied" });
  // }
  try {
    const user = await User.findOne({ email: Email });

    
    const challenge = new Challenges({
      title,
      description,
      points,
      enddate,
    });

    await challenge.save();
    res.status(201).json({
      message: "Challenge created successfully",
      challenge: challenge,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getAllChallenges = async (req, res) => {
  try {
    const challenges = await Challenges.find().sort({ createdAt: -1 });
    return res.status(200).json({ challenges });
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const getChallengeById = async (req, res) => {
  const { id } = req.params;
  const userid = req.user?.id;

  try {
    const challenge = await Challenges.findById({ _id: id });
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    const isSubmitted = challenge.participants.includes(userid);

    return res.status(200).json({ isSubmitted, challenge });
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const updateChallengeById = async (req, res) => {
  //   Admin Check
  const Email = req.user.email;

  const { id, title, description, points, enddate } = req.body;

  try {
    const user = await User.find({ email: Email });
    
    
    const updatedChallenge = await Challenges.findByIdAndUpdate(
      id,
      {
        title,
        description,
        points,
        enddate,
      },
      {
        new: true,
      }
    );

    return res.status(200).json({
      message: "Challenge updated successfully",
      challenge: updatedChallenge,
    });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const deleteChallengeById = async (req, res) => {
  //   Admin Check
  const Email = req.user.email;
  const { id } = req.body;
  console.log(id);
  try {
    const user = await User.find({ email: Email });
   
    await Challenges.findByIdAndDelete(id, {
      new: true,
    });
    return res.status(200).json({
      message: "Challenge deleted successfully",
      deletedChallengeId: id,
    });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
const submitChallenge = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;
  try {
    const challenge = await Challenges.findById(id);
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }
    const user = await User.findById(userId);
    if (
      challenge.participants.some((participant) =>
        participant._id.equals(user._id)
      )
    ) {
      return res.status(400).json({ message: "Already submitted" });
    }
    challenge.participants.push(user);
    user.points += challenge.points;
    await user.save();
    await challenge.save();
    return res
      .status(200)
      .json({ message: "Challenge submitted successfully", challenge });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  submitChallenge,
  createChallenge,
  getAllChallenges,
  getChallengeById,
  updateChallengeById,
  deleteChallengeById,
};
