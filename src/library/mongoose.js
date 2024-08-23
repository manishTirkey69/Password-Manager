const mongoose = require("mongoose");

const SCHEMA_NAME = "password_manager";
const url = `mongodb://localhost:27017/${SCHEMA_NAME}`;

// Schema definition
const passwordSchema = new mongoose.Schema({
  url: { type: String, required: false },
  userId: { type: String, required: false },
  password: { type: String, required: false },
  description: { type: String, required: false },
});

// model
const Passwords = mongoose.model("Passwords", passwordSchema);

// connecting to the mongoDB
mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(() => {
    console.log("Error connecting to MongoDB");
  });

// Exporting the model and the connection
module.exports.Model = Passwords;
module.exports.DB = mongoose.connection;
// example for checking if DB connection is ready or not
// DB.readyState === 1
