// server.js
require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Import routes
const authRoutes = require("./routes/auth.routes");
const foodRoutes = require("../src/routes/food.routes");
const foodPartnerRoute = require("./routes/food-partner.routes");

const app = express();

// Allowed origins
const allowedOrigins = [
  "https://food-reel-frontend.vercel.app",
  "https://food-reel-frontend-9e69snjew-yash-barbates-projects.vercel.app",
  "http://localhost:5173"
];

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // allow cookies
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/food-partner", foodPartnerRoute);

// Test route
app.get("/", (req, res) => {
  res.send("Hello World");
});

module.exports = app;
