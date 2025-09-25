// create server
require("dotenv").config();

const cookieParser = require("cookie-parser");
const express = require("express");
const authRoutes = require("./routes/auth.routes");
const foodRoutes = require("../src/routes/food.routes");
const foodPartnerRoute = require("./routes/food-partner.routes");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/food-partner", foodPartnerRoute);

app.get("/", (req, res) => {
  res.send("hello world");
});

module.exports = app;
