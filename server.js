// start server

require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/db/db");
const PORT = 3000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});
