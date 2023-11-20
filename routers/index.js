const router = require("express").Router();
const JournalController = require("../controllers/JournalController");
const AIController = require("../controllers/AIController");
const RecordController = require("../controllers/RecordController");
const UserController = require("../controllers/UserController");
const authentication = require("../middlewares/authentication");

router.post("/register", UserController.register);

router.post("/login", UserController.login);

router.use(authentication);

router.post("/quotes", AIController.generateQuote);
router.post("/journalResponse", AIController.journalResponse);

router.post("/records", RecordController.createRecord);
router.get("/records", RecordController.getRecords);

router.get("/journals/:id", JournalController.findById);

module.exports = router;
