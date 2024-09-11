require("dotenv").config();
const mode = process.env.mode;
const port = process.env.PORT;
const jwt_secret = process.env.JWT_SECRET;

// cloudinary
const cloudName = process.env.CLOUD_NAME;
const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;

module.exports = {
  mode,
  port,
  jwt_secret,
  cloudName,
  apiKey,
  apiSecret,
};
