const foodPartnerModel = require("../models/foodpartner.model");
const userModel = require("../models/user.model");

const jwt = require("jsonwebtoken");

async function authFoodPartnerMiddleware(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({
      // message: "unauthorise access",
      message: "token not found",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const foodPartner = await foodPartnerModel.findById(decoded._id);

    if (!foodPartner) {
      return res.status(404).json({
        message: "food partner not found",
      });
    }

    // using this we can set foodParter property to req and pass food partner value
    req.foodPartner = foodPartner;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "invalid token",
      error: err,
    });
  }
}

async function authUserMiddleware(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(400).json({
      message: "login first",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded._id);

    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({
      message: "invalid token",
    });
  }
}

module.exports = {
  authFoodPartnerMiddleware,
  authUserMiddleware,
};
