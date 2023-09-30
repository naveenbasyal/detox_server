const {
  loginUser,
  registerUser,
  getAllUsers,
  getUserById,
  updateUserById,
  forgotpassword,
  resetpassword,
  deleteUser,
  verifyUser,
} = require("../controllers/userControllers");
const verifyToken = require("../middlewares/verifyToken");

const router = require("express").Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgotpassword", forgotpassword);
router.post("/resetpassword/:id/:token", resetpassword);
router.get("/", verifyToken, getAllUsers);
router.get("/:id", verifyToken, getUserById);
router.get("/verify/:id/:token", verifyUser);
router.put("/update/:id", verifyToken, updateUserById);
router.delete("/", verifyToken, deleteUser);

module.exports = router;
