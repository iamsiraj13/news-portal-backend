const {
  addNews,
  getImages,
  addImages,
  getDashboardNews,
  getDashboardNewsById,
  updateNews,
} = require("../controllers/news.controller");
const { authGuard } = require("../middleware/middleware");

const newsRoute = require("express").Router();

newsRoute.post("/news/add", authGuard, addNews);
newsRoute.put("/news/update/:newsId", authGuard, updateNews);
newsRoute.get("/images", authGuard, getImages);
newsRoute.post("/images/add", authGuard, addImages);
newsRoute.get("/news", authGuard, getDashboardNews);
newsRoute.get("/news/:newsId", authGuard, getDashboardNewsById);
module.exports = newsRoute;
