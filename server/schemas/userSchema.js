const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const shopUser = new Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  backet: {
    type: Array,
    default: []
  },
  userType: {
    type: String,
    default: "user"
  }
});

const User = mongoose.model("shopuser", shopUser);
module.exports = User;
