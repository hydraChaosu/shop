var express = require("express");
var router = express.Router();
const auth = require("./verifytoken");
const User = require("./../schemas/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;

/* GET home page. */
// router.get("/", auth, function(req, res, next) {
//   User.findOne({ _id: req.user._id }).then(user => {
//     if (!user) {
//       return res.json({ msg: "This user does not exists", success: false });
//     } else {
//       res.json({ title: "Express", user });
//     }
//   });
// });
// router.post("/register", function(req, res, next) {
//   res.render("index", { title: "Express" });
// });

router.post("/login", function(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      msg: `You don't inserted information about ${!email ? "email" : ""} 
       ${!password ? "password" : ""}`,
      success: false
    });
  }
  User.findOne({ email }).then(user => {
    if (!user) {
      return res
        .status(400)
        .json({ msg: "This user does not exists", success: false });
    }
    bcrypt
      .compare(password, user.password)
      .then(result => {
        if (result) {
          const token = jwt.sign(
            { _id: user._id, name: user.name },
            process.env.TOKEN_SECRET
          );
          res.header("auth-token", token);
          return res.json({ success: true, token });
        }
        return res
          .status(400)
          .json({ msg: "incorrect password", success: false });
      })
      .catch(err => {
        if (err) throw err;
      });
  });
});

router.get("/userdata", auth, (req, res) => {
  // -pasword nie beidze hasla
  User.findOne({ _id: req.user._id })
    .select("-password")
    .then(user => {
      console.group(user, "getuser");
      res.json(user);
    });
});

module.exports = router;
