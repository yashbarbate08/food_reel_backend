const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const foodController = require("../controllers/food.controller");
const multer = require("multer");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

// POST api/food/   [protected route]

router.post(
  "/",
  authMiddleware.authFoodPartnerMiddleware,
  upload.single("video"),
  foodController.createFood
);

router.get("/", authMiddleware.authUserMiddleware, foodController.getFoodItems);

router.post(
  "/like",
  authMiddleware.authUserMiddleware,
  foodController.likeFood
);

router.post(
  "/save",
  authMiddleware.authUserMiddleware,
  foodController.saveFood
);

router.get(
  "/save",
  authMiddleware.authUserMiddleware,
  foodController.getSaveFood
);

router.post(
  "/comment",
  authMiddleware.authUserMiddleware,
  foodController.commentFood
);
router.get(
  "/comment/:foodId",
  authMiddleware.authUserMiddleware,
  foodController.getCommentFood
);

module.exports = router;
