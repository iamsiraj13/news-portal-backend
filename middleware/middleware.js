const jwt = require("jsonwebtoken");
const { jwt_secret } = require("../env");

// Check is authenticate or not
const authGuard = async (req, res, next) => {
  // extract the token
  const token = req.headers.authorization.split(" ")[1];

  if (token) {
    try {
      // Verify user based on token
      const userInfo = jwt.verify(token, jwt_secret);
      req.userInfo = userInfo;
      next();
    } catch (error) {
      return res.status(401).json({
        status: "Failed",
        message: "Unauthorized",
      });
    }
  } else {
    return res.status(401).json({
      status: "Failed",
      message: "Unauthorized",
    });
  }
};

const role = async (req, res, next) => {
  const { userInfo } = req;

  if (userInfo.role === "admin") {
    next();
  } else {
    return res.status(401).json({
      status: "Failed",
      message: "Unable to access",
    });
  }
};

module.exports = { authGuard, role };
