const {
  getAllEntries,
  createDailyEntry,
  deleteEntryById,
  updateEntryById,
  getEntryById,
  getAllPublicEntries,
  getPublicEntryById,
  getAllEntriesForCalendar,
} = require("../controllers/dailyEntriesControllers");
const verifyToken = require("../middlewares/verifyToken");

const router = require("express").Router();

// get all entries of a user who is logged in
router.get("/", verifyToken, getAllEntries);
// get all entries of a user to show the calendar while inspecting the user
router.get("/calendar/:id", verifyToken, getAllEntriesForCalendar);
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
