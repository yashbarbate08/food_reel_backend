const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  video: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  foodPartner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "foodpartner",
  },
  likeCount: {
    type: "number",
    default: 0,
  },
  saveCount: {
    type: "number",
    default: 0,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comment",
    },
  ],
});

const foodModel = mongoose.model("food", foodSchema);

module.exports = foodModel;
