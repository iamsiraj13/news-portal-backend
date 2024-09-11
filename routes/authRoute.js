const {
  login,
  addWriter,
  getWriter,
} = require("../controllers/auth.controller");
const { authGuard, role } = require("../middleware/middleware");

const userRoute = require("express").Router();

userRoute.post("/login", login);
userRoute.post("/news/writer/add", authGuard, role, addWriter);
userRoute.get("/news/writers", authGuard, role, getWriter);

module.exports = userRoute;
