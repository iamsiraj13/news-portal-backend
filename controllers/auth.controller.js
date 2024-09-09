const authModel = require("../models/auth.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { jwt_secret } = require("../env");

const login = async (req, res) => {
  // Extract perameter from req.body

  const { email, password } = req.body;

  // Check all fields are profided

  if (!email) {
    return res.status(400).json({
      status: "Failed",
      message: "Email is require !",
    });
  }
  if (!password) {
    return res.status(400).json({
      status: "Failed",
      message: "password is require !",
    });
  }

  try {
    const user = await authModel.findOne({ email }).selectd("+password");
    // Check if user is exist or not
    if (!user) {
      return res.status(404).json({
        status: "Failed",
        message: "User not found",
      });
    }

    // check password match

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({
        status: "Failed",
        message: "Invalid Password",
      });
    }

    // Generate token for user
    const payload = {
      id: user._id,
      name: user.name,
      category: user.category,
      role: user.role,
    };

    const token = await jwt.sign(payload, jwt_secret, {
      expiresIn: "2d",
    });

    res.status(201).json({
      status: "Failed",
      message: "Login Successfull",
      token: token,
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: "Unable to login, Please try again letter",
    });
  }
};

module.exports = { login };
