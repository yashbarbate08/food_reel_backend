const foodPartnerModel = require("../models/foodpartner.model");
const foodModel = require("../models/food.model");

async function getFoodPartnerById(req, res) {
  try {
    const foodPartnerId = req.params.id;

    const foodpartner = await foodPartnerModel.findById(foodPartnerId);

    if (!foodpartner) {
      return res.status(404).json({
        message: "Food partner not found",
      });
    }

    const foodItemsByFoodPartner = await foodModel.find({
      foodPartner: foodPartnerId,
    });

    return res.status(200).json({
      message: "Food partner fetched successfully",
      foodPartner: {
        ...foodpartner.toObject(),
        foodItems: foodItemsByFoodPartner,
      },
    });
  } catch (error) {
    console.error("Error in getFoodPartnerById:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

module.exports = {
  getFoodPartnerById,
};
