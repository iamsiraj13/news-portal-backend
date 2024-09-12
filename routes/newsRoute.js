const { addNews, getImages } = require("../controllers/news.controller");
const { authGuard } = require("../middleware/middleware");

const newsRoute = require("express").Router();

newsRoute.post("/news/add", authGuard, addNews);
newsRoute.get("/images ", authGuard, getImages);

module.exports = newsRoute;
