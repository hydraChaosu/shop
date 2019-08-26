const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
// const mongoURI = require("./config/mongoConfig");
const dotenv = require("dotenv");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const shopItemsRouter = require("./routes/shopItems");
// const cors = require("cors");

// app.use(cors()); // Use this after the variable declaration
dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
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
// const port = process.env.PORT || 5000;

// app.listen(port, () => {
//   console.log(`Server started on port ${port}`);
// });
// if (process.env.NODE_ENV === "production") {
//   //setstatic folder
//   app.use(express.static("client/build"));
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// }

module.exports = app;
//localhost 5000
