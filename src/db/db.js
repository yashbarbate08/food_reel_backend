const mongoose = require("mongoose");

function connectDB() {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
      console.log("MongoDB Connected");
    })
    .catch((err) => {
      console.log(`MongoDB Connection Err: ${err}`);
    });
}

module.exports = connectDB;
