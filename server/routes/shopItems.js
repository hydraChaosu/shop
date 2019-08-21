const express = require("express");
const router = express.Router();
const ShopItem = require("./../schemas/itemSchema");

//GET ITEMS
router.get("/", function(req, res) {
  return ShopItem.find().then(items => res.json(items));
});

//ADD ITEM
router.post("/", function(req, res, next) {
  const { name, description, quantity } = req.body;
  if (!name || !description || !quantity) {
    return res.json({
      msg: `You don't inserted information about ${!name ? "name" : ""} ${
        !description ? "description" : ""
      } ${!quantity ? "quantity" : ""}`
    });
  }
  ShopItem.findOne({ name }).then(shopItem => {
    if (shopItem) {
      return res.json({ msg: "This shop item already exists" });
    }
    const newShopItem = new ShopItem({ name, description, quantity });
    console.log(newShopItem);
    newShopItem.save().then(item => res.json(item));
  });
});

//CHANGE ITEM QUANTITY, DESC, NAME
router.patch("/", function(req, res) {
  let { id, name, description, quantity } = req.body;
  ShopItem.findById(id)
    .then(item => {
      console.log(item);
      !name ? (name = item.name) : name;
      !description ? (description = item.description) : description;
      !quantity ? (quantity = item.quantity) : quantity;
      return item.updateOne({ name, description, quantity });
    })
    .then(() => res.json({ success: true }))
    .catch(err => res.json({ msg: err }));
});

//REMOVE ITEM
router.delete("/:id", function(req, res) {
  const { id } = req.params;
  ShopItem.findById(id)
    .then(item => item.remove())
    .then(() => res.json({ success: true }))
    .catch(err => res.json({ msg: err }));
});

module.exports = router;
