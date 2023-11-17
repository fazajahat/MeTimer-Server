require("dotenv").config();
const cors = require("cors");
const express = require("express");
const { connectDB } = require("./config/mongodb.config");
const errorHandler = require("./middlewares/ErrorHandler");
const app = express();
const router = require("./routers");
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/", router);

// Error Handler
app.use(errorHandler);

connectDB().then((db) => {
  app.listen(PORT, () => {
    console.log("Server started on port " + PORT);
  });
});


module.exports = app;