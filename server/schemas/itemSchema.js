const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const shopItem = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  }
});

const Item = mongoose.model("shopitem", shopItem);
module.exports = Item;
