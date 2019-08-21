const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require("./../schemas/userSchema");
/* GET users listing. */
router.post("/login", function(req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({
      msg: `You don't inserted information about ${!email ? "email" : ""} 
       ${!password ? "password" : ""}`,
      success: false
    });
  }
  User.findOne({ email }).then(user => {
    if (!user) {
      return res.json({ msg: "This user does not exists", success: false });
    }
    bcrypt
      .compare(password, user.password)
      .then(result => {
        console.log(user);
        if (result) return res.json({ user: user.name, success: true });
        return res.json({ msg: "incorrect password", success: false });
      })
      .catch(err => {
        if (err) throw err;
      });
  });
});

router.post("/register", function(req, res, next) {
  const { name, email, password } = req.body;
  const bucket = [];
  const userType = "user";
  let valid = true;
  let errors = { name: "", email: "", password: "", success: false };
  if (!name || !email || !password) {
    return res.json({
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

  if (!valid) return res.json(errors);

  User.findOne({ email }).then(user => {
    if (user) {
      return res.json({ msg: "This user already exists", success: false });
    }
    bcrypt.hash(password, saltRounds, function(err, hash) {
      if (err) throw err;
      let password = hash;
      const newUser = new User({ name, email, password, bucket, userType });
      console.log(newUser);
      newUser.save().then(item => res.json({ success: true }));
    });
  });
});

module.exports = router;
