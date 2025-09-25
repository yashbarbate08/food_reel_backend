const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// user auth API's
router.post("/user/register", authController.registerUser);

router.post("/user/login", authController.loginUser);

router.get("/user/logout", authController.logoutUser);

// food partner auth API's

router.post("/food-partner/register", authController.registerFoodpartner);

router.post("/food-partner/login", authController.loginFoodPartner);

router.get("/food-partner/logout", authController.logoutFoodPartner);

module.exports = router;
