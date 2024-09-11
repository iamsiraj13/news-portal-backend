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
    const user = await authModel.findOne({ email }).select("+password");
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
      id: user.id,
      name: user.name,
      category: user.category,
      role: user.role,
    };

    const token = jwt.sign(payload, jwt_secret, {
      expiresIn: "2d",
    });

    res.status(201).json({
      status: "Success",
      message: "Login Successfull",
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "Failed",
      message: "Unable to login, Please try again letter",
    });
  }
};
const addWriter = async (req, res) => {
  // Extract perameter from req.body
  const { name, email, category, password } = req.body;
  console.log(req.body);

  // Check all fields are profided
  if (!name) {
    return res.status(400).json({
      status: "Failed",
      message: "name is require !",
    });
  }
  if (!email) {
    return res.status(400).json({
      status: "Failed",
      message: "Email is require !",
    });
  }
  if (!category) {
    return res.status(400).json({
      status: "Failed",
      message: "category is require !",
    });
  }
  if (!password) {
    return res.status(400).json({
      status: "Failed",
      message: "password is require !",
    });
  }

  if (
    email &&
    !email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
  ) {
    return res.status(400).json({
      status: "Failed",
      message: "Invalid email address",
    });
  }

  try {
    const writer = await authModel.findOne({ email });
    if (writer) {
      return res.status(400).json({
        message: "User already exist",
      });
    } else {
      const newWriter = await authModel.create({
        name: name.trim(),
        email: email.trim(),
        password: await bcrypt.hash(password.trim(), 10),
        category: category.trim(),
        role: "writer",
      });
      return res.status(200).json({
        status: "Success",
        message: "Writer created successfull",
        writer: newWriter,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "Failed",
      message: "Unable to create writer, Please try again letter",
    });
  }
};
const getWriter = async (req, res) => {
  try {
    const writers = await authModel
      .find({ role: "writer" })
      .sort({ createdAt: -1 });

    res.status(200).json({
      writers: writers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "Failed",
      message: "Unable to get writer, Please try again letter",
    });
  }
};

module.exports = { login, addWriter, getWriter };
