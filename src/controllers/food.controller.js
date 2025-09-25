const foodModel = require("../models/food.model");
const likeModel = require("../models/likes.model");
const saveModel = require("../models/save.model");
const storageService = require("../services/storage.service");
const { v4: uuid } = require("uuid"); // Works with uuid@7
const commentModel = require("../models/comment.model");

async function createFood(req, res) {
  try {
    const fileUploadResult = await storageService.uploadFile(
      req.file.buffer,
      uuid()
    );

    const foodItem = await foodModel.create({
      name: req.body.name,
      description: req.body.description,
      video: fileUploadResult.url,
      foodPartner: req.foodPartner._id,
    });

    res.status(201).json({
      message: "Food item created successfully",
      food: foodItem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getFoodItems(req, res) {
  try {
    const foodItems = await foodModel.find({});

    res.status(200).json({
      message: "Food items retrieved successfully",
      foodItems,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function likeFood(req, res) {
  try {
    const { foodId } = req.body;
    const user = req.user;

    const isAlreadyLiked = await likeModel.findOne({
      user: user._id,
      food: foodId,
    });

    if (isAlreadyLiked) {
      // Unlike
      await likeModel.deleteOne({ user: user._id, food: foodId });

      const updatedFood = await foodModel.findByIdAndUpdate(
        foodId,
        { $inc: { likeCount: -1 } },
        { new: true, runValidators: true }
      );

      if (updatedFood.likeCount < 0) {
        updatedFood.likeCount = 0;
        await updatedFood.save();
      }

      return res.status(200).json({
        message: "Food unliked successfully",
        liked: false,
        likeCount: updatedFood.likeCount,
      });
    }

    // Like
    await likeModel.create({ user: user._id, food: foodId });

    const updatedFood = await foodModel.findByIdAndUpdate(
      foodId,
      { $inc: { likeCount: 1 } },
      { new: true }
    );

    res.status(201).json({
      message: "Food liked successfully",
      liked: true,
      likeCount: updatedFood.likeCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

async function saveFood(req, res) {
  try {
    const { foodId } = req.body;
    const user = req.user;

    const isAlreadySaved = await saveModel.findOne({
      food: foodId,
      user: user._id,
    });

    if (isAlreadySaved) {
      await saveModel.deleteOne({ food: foodId, user: user._id });
      await foodModel.findByIdAndUpdate(foodId, { $inc: { saveCount: -1 } });

      return res.status(200).json({
        message: "Food unsaved successfully",
      });
    }

    await saveModel.create({ food: foodId, user: user._id });
    await foodModel.findByIdAndUpdate(foodId, { $inc: { saveCount: 1 } });

    res.status(201).json({
      message: "Food saved successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

async function getSaveFood(req, res) {
  try {
    const user = req.user;
    const savedFoods = await saveModel.find({ user: user._id }).populate("food");

    if (!savedFoods || savedFoods.length === 0) {
      return res.status(404).json({ message: "No saved foods found" });
    }

    res.status(200).json({
      message: "Saved foods retrieved successfully",
      savedFoods,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function commentFood(req, res) {
  try {
    const { foodId, comment } = req.body;
    const user = req.user;

    if (!foodId || !comment) {
      return res.status(400).json({ message: "Food ID and comment are required" });
    }

    const newComment = await commentModel.create({
      user: user._id,
      food: foodId,
      comment,
    });

    await foodModel.findByIdAndUpdate(foodId, {
      $push: { comments: newComment._id },
    });

    res.status(201).json({
      message: "Comment posted successfully",
      comment: newComment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getCommentFood(req, res) {
  try {
    const { foodId } = req.params;
    if (!foodId) {
      return res.status(400).json({ message: "Food ID is required" });
    }

    const comments = await commentModel
      .find({ food: foodId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    if (!comments || comments.length === 0) {
      return res.status(404).json({ message: "No comments found for this food" });
    }

    res.status(200).json({
      message: "Comments retrieved successfully",
      comments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createFood,
  getFoodItems,
  likeFood,
  saveFood,
  getSaveFood,
  commentFood,
  getCommentFood,
};
