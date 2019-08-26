const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require("./../schemas/userSchema");
const jwt = require("jsonwebtoken");

router.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.body);
  const bucket = [];
  const userType = "user";
  let valid = true;
  let errors = { name: "", email: "", password: "", success: false };
  if (!name || !email || !password) {
    return res.status(400).json({
      msg: `You don't inserted information about ${!name ? "name" : ""} ${
        !email ? "email" : ""
      } ${!password ? "password" : ""}`
    });
  }
  if (password.length < 8) {
    errors.password +=
      "password is too short it should be minimum 8 letters long";
    valid = false;
  }

  if (name.length < 8) {
    errors.name += "name is too short it should be minimum 8 letters long";
    valid = false;
  }

  const regex = new RegExp(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
  if (!email.match(regex)) {
    errors.email += "email is not valid";
    valid = false;
  }

  if (!valid) return res.status(400).json(errors);

  User.findOne({ email }).then(user => {
    if (user) {
      return res
        .status(400)
        .json({ msg: "This user already exists", success: false });
    }
    bcrypt.hash(password, saltRounds, function(err, hash) {
      if (err) throw err;
      let password = hash;
      const newUser = new User({ name, email, password, bucket, userType });
      console.log(newUser);
      try {
        newUser.save().then(item => res.json({ success: true }));
      } catch (err) {
        res.status(400).send(err);
      }
    });
  });
});

module.exports = router;
