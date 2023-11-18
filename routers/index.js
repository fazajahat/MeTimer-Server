const router = require("express").Router();
const QuoteController = require("../controllers/QuoteController");
const RecordController = require("../controllers/RecordController");
const UserController = require("../controllers/UserController");
const authentication = require("../middlewares/authentication");

router.post("/register", UserController.register);

router.post("/login", UserController.login);

router.use(authentication);

router.get("/quotes", QuoteController.generateQuote);

router.post("/records", RecordController.createRecord);
router.get("/records", RecordController.getRecords);

module.exports = router;
