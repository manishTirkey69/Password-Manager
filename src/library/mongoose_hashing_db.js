const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const SCHEMA_NAME = "password_manager";
const SALT_WORK_FACTOR = 10; // Adjust this value as necessary
const url = `mongodb://localhost:27017/${SCHEMA_NAME}`;

// Schema definition
const passwordSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // tags: {
  //   type: Map,
  //   of: String,
  // },
});

// Pre-save hook to hash the password
passwordSchema.pre("save", function (next) {
  const passcode = this;

  // Only hash the password if it has been modified (or is new)
  if (!passcode.isModified("password")) return next();

  // Generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);

    // Hash the password using the generated salt
    bcrypt.hash(passcode.password, salt, function (err, hash) {
      if (err) return next(err);

      // Override the plain text password with the hashed one
      passcode.password = hash;
      next();
    });
  });
});

// Method to compare a given password with the database hash
passwordSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

// Model creation
const Passwords = mongoose.model("Passwords", passwordSchema);

// Creating an async function to handle database operations
async function run() {
  try {
    // Establishing a connection with MongoDB
    await mongoose.connect(url);
    console.log("Successfully connected to MongoDB.");

    // Creating a new password document
    const googlePass = new Passwords({
      userId: "1",
      password: "superSecretPassword123",
      // tags: {
      //   tag1: "tag1",
      //   tag2: "tag2",
      // },
    });

    // Saving the document to the database
    await googlePass.save();
    console.log("User created and password hashed");

    // Verifying the password
    googlePass.comparePassword("superSecretPassword123", (err, isMatch) => {
      if (err) {
        console.error("Error comparing password:", err);
      } else {
        console.log("Password is correct:", isMatch);
      }
    });
  } catch (error) {
    console.error("An error occurred:", error);

    // Close the connection if an error occurs
    mongoose.connection.close();
  }
}

// Running the async function
run();

// Exporting the model and the connection
module.exports = Passwords;
module.exports.connection = mongoose.connection;
