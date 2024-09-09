require("dotenv").config();
const mode = process.env.mode;
const port = process.env.PORT;
const jwt_secret = process.env.JWT_SECRET;

module.exports = {
  mode,
  port,
  jwt_secret,
};
