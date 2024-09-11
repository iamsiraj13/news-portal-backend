const { login, addWriter } = require("../controllers/auth.controller");
const { authGuard, role } = require("../middleware/middleware");

const userRoute = require("express").Router();

userRoute.post("/login", login);
userRoute.post("/news/writer/add", authGuard, role, addWriter);

module.exports = userRoute;
