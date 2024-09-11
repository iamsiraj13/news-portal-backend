const { formidable } = require("formidable");
const cloudinary = require("cloudinary").v2;
const moment = require("moment");
const newsModel = require("../models/news.model");

const addNews = async (req, res) => {
  const { id, name, category } = req.userInfo || {}; // Ensure userInfo exists

  const form = formidable({});
  // Make sure to load the Cloudinary credentials properly
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true,
  });

  try {
    const [fields, files] = await form.parse(req);

    const { url } = await cloudinary.uploader.upload(files.image[0].filepath, {
      folder: "news",
    });

    const { title, description } = fields;

    const news = await newsModel.create({
      writerId: id,
      title: title[0].trim(),
      slug: title[0].trim().split(" ").join("-"),
      category,
      description: description[0],
      date: moment().format("LL"),
      writerName: name,
      image: url,
    });

    res.status(201).json({ message: "news adder", news });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};
module.exports = { addNews };
