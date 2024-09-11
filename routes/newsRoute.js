const { addNews } = require("../controllers/news.controller");
const { authGuard } = require("../middleware/middleware");

const newsRoute = require("express").Router();

newsRoute.post("/news/add", authGuard, addNews);

module.exports = newsRoute;
