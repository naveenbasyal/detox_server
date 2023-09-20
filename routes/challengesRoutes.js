const {
  createChallenge,
  deleteChallengeById,
  updateChallengeById,
  getAllChallenges,
  getChallengeById,
  submitChallenge,
} = require("../controllers/challengesControllers");

const verifyToken = require("../middlewares/verifyToken");
const router = require("express").Router();

// user
router.post("/submit/:id", verifyToken, submitChallenge);
router.get("/", verifyToken, getAllChallenges);
router.get("/:id", verifyToken, getChallengeById);
// admin
router.post("/create", verifyToken, createChallenge);
router.put("/:id", verifyToken, updateChallengeById);
router.delete("/:id", verifyToken, deleteChallengeById);

module.exports = router;
