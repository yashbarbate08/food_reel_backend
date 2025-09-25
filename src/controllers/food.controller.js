const foodModel = require("../models/food.model");
const likeModel = require("../models/likes.model");
const saveModel = require("../models/save.model");
const storageService = require("../services/storage.service");
const { v4: uuid } = require("uuid");
const commentModel = require("../models/comment.model");

async function createFood(req, res) {
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
    message: "food item created succesfully",
    food: foodItem,
  });
}

async function getFoodItems(req, res) {
  const foodItems = await foodModel.find({});

  res.status(201).json({
    message: "food item get succesfully",
    foodItems,
  });
}

// async function likeFood(req, res) {
//   try {
//     const { foodId } = req.body;
//     const user = req.user;

//     // Check if the user already liked the food
//     const isAlreadyLiked = await likeModel.findOne({
//       user: user._id,
//       food: foodId,
//     });

//     if (isAlreadyLiked) {
//       // Unlike the food
//       await likeModel.deleteOne({
//         user: user._id,
//         food: foodId,
//       });

//       // Decrement like count in the food collection
//       await foodModel.findByIdAndUpdate(
//         foodId,
//         {
//           $inc: { likeCount: -1 },
//         },
//         { new: true, runValidators: true }
//       );

//       return res.status(200).json({
//         message: "Food unliked successfully",
//       });
//     }

//     // Like the food
//     const newLike = await likeModel.create({
//       user: user._id,
//       food: foodId,
//     });

//     // Increment like count in the food collection
//     await foodModel.findByIdAndUpdate(foodId, {
//       $inc: { likeCount: 1 },
//     });

//     res.status(201).json({
//       message: "Food liked successfully",
//       like: newLike, // now 'like' is defined
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// }

async function likeFood(req, res) {
  try {
    const { foodId } = req.body;
    const user = req.user;

    const isAlreadyLiked = await likeModel.findOne({
      user: user._id,
      food: foodId,
    });

    if (isAlreadyLiked) {
      // Unlike the food
      await likeModel.deleteOne({ user: user._id, food: foodId });

      const updatedFood = await foodModel.findByIdAndUpdate(
        foodId,
        { $inc: { likeCount: -1 } },
        { new: true, runValidators: true }
      );

      // Prevent negative values
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

    // Like the food
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
  const { foodId } = req.body;
  const user = req.user;

  const isAlreadySave = await saveModel.findOne({
    food: foodId,
    user: user._id,
  });

  if (isAlreadySave) {
    const unsave = await saveModel.deleteOne({
      food: foodId,
      user: user._id,
    });
    await foodModel.findByIdAndUpdate(foodId, {
      $inc: { saveCount: -1 },
    });
    return res.status(200).json({
      message: " food unsave succesfully",
      unsave,
    });
  }

  const saveFood = await saveModel.create({
    food: foodId,
    user: user._id,
  });
  await foodModel.findByIdAndUpdate(foodId, {
    $inc: { saveCount: 1 },
  });

  res.status(201).json({
    message: "food save succesfully",
    saveFood,
  });
}

async function getSaveFood(req, res) {
  const user = req.user;

  const savedFoods = await saveModel.find({ user: user._id }).populate("food");

  if (!savedFoods || savedFoods.length === 0) {
    return res.status(404).json({ message: "No saved foods found" });
  }

  res.status(200).json({
    message: "Saved foods retrieved successfully",
    savedFoods,
  });
}

async function commentFood(req, res) {
  try {
    const { foodId, comment } = req.body;
    const user = req.user;

    if (!foodId || !comment) {
      return res
        .status(400)
        .json({ message: "Food ID and comment are required" });
    }

    const newComment = await commentModel.create({
      user: user._id,
      food: foodId,
      comment: comment,
    });

    await foodModel.findByIdAndUpdate(foodId, {
      $push: { comments: newComment._id },
    });

    res.status(201).json({
      message: "Comment posted successfully",
      comment: newComment,
    });
  } catch (error) {
    console.error("Error posting comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// async function getCommentFood(req, res) {
//   const user = req.user;

//   const comments = await commentModel
//     .find({ user: user._id })
//     .populate("comment");

//   if (!comments || comments.length === 0) {
//     return res.status(404).json({
//       message: "comment not fount",
//     });
//   }
//   res.status(201).json({
//     message: "comment get succesfully",
//     comments,
//   });
// }

async function getCommentFood(req, res) {
  try {
    const { foodId } = req.params;
    if (!foodId) {
      return res.status(400).json({ message: "Food ID is required" });
    }

    const comments = await commentModel
      .find({ food: foodId }) // get only comments for this food
      .populate("user", "name email") // populate user info
      .sort({ createdAt: -1 }); // latest comment first

    if (!comments || comments.length === 0) {
      return res.status(404).json({
        message: "No comments found for this food",
      });
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
