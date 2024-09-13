const jwt = require("jsonwebtoken");
const { jwt_secret } = require("../env");

// Check is authenticate or not
const authGuard = async (req, res, next) => {
  try {
    // Extract the token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "Failed",
        message: "Unauthorized: No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: "Failed",
        message: "Unauthorized: Token missing",
      });
    }

    // Verify user based on token
    const userInfo = jwt.verify(token, jwt_secret);
    req.userInfo = userInfo;
    next();
  } catch (error) {
    return res.status(401).json({
      status: "Failed",
      message: "Unauthorized: Invalid token",
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
