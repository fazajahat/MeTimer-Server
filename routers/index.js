const router = require("express").Router();
const JournalController = require("../controllers/JournalController");
const AIController = require("../controllers/AIController");
const RecordController = require("../controllers/RecordController");
const UserController = require("../controllers/UserController");
const authentication = require("../middlewares/authentication");

// Done
router.post("/register", UserController.register);
router.post("/login", UserController.login);

router.use(authentication);


router.get("/users", UserController.getUserDetail);

//Faza
router.post("/quotes", AIController.generateQuote);

// Done
router.post("/journalResponse", AIController.journalResponse);

router.post("/records", RecordController.createRecord);
router.get("/records", RecordController.getRecords);
router.get("/records/:recordId", RecordController.getRecordById);

// Done
router.get("/journals/:id", JournalController.findById);

//Faza
router.post("/chatLogs", AIController.postChatAI);
router.get("/chatLogs", AIController.getChatLogs);

module.exports = router;
