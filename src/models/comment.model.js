const mongoose = require("mongoose");

const comentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    food: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "food",
      required: true,
    },
    comment: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const commentModel = mongoose.model("comment", comentSchema);
module.exports = commentModel;
