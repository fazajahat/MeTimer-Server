const router = require("express").Router();
const QuoteController = require("../controllers/QuoteController");
const UserController = require("../controllers/UserController");

router.post("/register", UserController.register);

router.post("/login", UserController.login);

router.get("/quotes", QuoteController.generateQuote);

module.exports = router;
