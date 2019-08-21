const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const mongoURI = require("./config/mongoConfig");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const shopItemsRouter = require("./routes/shopItems");
const cors = require("cors");

const app = express();
app.use(cors()); // Use this after the variable declaration

mongoose
  .connect(mongoURI, { useNewUrlParser: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/shop", shopItemsRouter);
// const port = process.env.PORT;

// app.listen(port, () => {
//   console.log(`Server started on port ${port}`);
// });

module.exports = app;
//localhost 5000
