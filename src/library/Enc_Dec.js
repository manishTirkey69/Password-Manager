const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

const isProd = process.mainModule?.filename.includes('app.asar');

// Dynamically resolve path to .env
const dotenvPath = isProd
  ? path.join(process.resourcesPath, ".env")  // ✅ for production build
  : path.join(__dirname, "../../.env");       // ✅ for dev (adjust if needed)


// const dotenvPath = path.join(process.resourcesPath, ".env");
// require("dotenv").config({ path: dotenvPath });


// require("dotenv").config({
//   path: require("path").resolve(__dirname, "../../.env"),
// });

// Load .env safely
if (fs.existsSync(dotenvPath)) {
  dotenv.config({ path: dotenvPath });
  console.log("[.env] Loaded from:", dotenvPath);
} else {
  console.warn("[.env] Not found at:", dotenvPath);
}

// Validate required env variables
if (!process.env.SECRET_KEY || !process.env.IV) {
  throw new Error("❌ Missing SECRET_KEY or IV in .env file.");
}

const algorithm = "aes-256-cbc";
const secretKey = Buffer.from(process.env.SECRET_KEY, "hex");
const iv = Buffer.from(process.env.IV, "hex");

// Encrypt function
function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

// Decrypt function
function decrypt(encryptedData) {
  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

module.exports.Encrypt = encrypt;
module.exports.Decrypt = decrypt;
