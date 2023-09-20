const {
  getAllEntries,
  createDailyEntry,
  deleteEntryById,
  updateEntryById,
  getEntryById,
  getAllPublicEntries,
} = require("../controllers/dailyEntriesControllers");
const verifyToken = require("../middlewares/verifyToken");

const router = require("express").Router();

router.get("/", verifyToken, getAllEntries);
router.get("/allpublicentries", verifyToken, getAllPublicEntries);
router.post("/create", verifyToken, createDailyEntry);
router.delete("/:id", verifyToken, deleteEntryById);
router.put("/:id", verifyToken, updateEntryById);
router.get("/:id", verifyToken, getEntryById);

module.exports = router;