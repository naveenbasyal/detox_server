const {
  getAllEntries,
  createDailyEntry,
  deleteEntryById,
  updateEntryById,
  getEntryById,
  getAllPublicEntries,
  getPublicEntryById,
} = require("../controllers/dailyEntriesControllers");
const verifyToken = require("../middlewares/verifyToken");

const router = require("express").Router();

// get all entries of a user
router.get("/", verifyToken, getAllEntries);
// get all public entries of all the users
router.get("/allpublicentries", verifyToken, getAllPublicEntries);
// get public entry of a user by id
router.get("/publicEntry/:id", verifyToken, getPublicEntryById);
// create a new entry
router.post("/create", verifyToken, createDailyEntry);
// delete a single entry by id
router.delete("/:id", verifyToken, deleteEntryById);
// update a single entry by id
router.put("/:id", verifyToken, updateEntryById);
// get a single entry by id
router.get("/:id", verifyToken, getEntryById);

module.exports = router;
