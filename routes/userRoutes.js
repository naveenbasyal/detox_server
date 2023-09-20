const {
  loginUser,
  registerUser,
  getAllUsers,
  getUserById,
  updateUserById,
} = require("../controllers/userControllers");
const verifyToken = require("../middlewares/verifyToken");

const router = require("express").Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", verifyToken,getAllUsers);
router.get("/:id", verifyToken,getUserById);
router.put("/update/:id", verifyToken,updateUserById);

module.exports = router;
