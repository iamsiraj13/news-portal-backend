const { login } = require("../controllers/auth.controller");

const userRoute = require("express").Router();

userRoute.post("/login", login);

module.exports = userRoute;
