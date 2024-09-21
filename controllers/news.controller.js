const { formidable } = require("formidable");
const cloudinary = require("cloudinary").v2;
const moment = require("moment");
const newsModel = require("../models/news.model");
const imageModel = require("../models/gallery.model");
const { Types } = require("mongoose");

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

    res.status(201).json({ message: "News create successfull", news });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: "Unable to create news, Please try again letter.",
    });
  }
};

const getImages = async (req, res) => {
  try {
    const { id } = req.userInfo;
    const images = await imageModel
      .find({ writerId: new Types.ObjectId(id) })
      .sort({ createdAt: -1 });
    return res.status(200).json({
      status: "Success",
      images: images,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "Failed",
      message: "Unable to get images, Please try again later.",
    });
  }
};

const addImages = async (req, res) => {
  try {
    const { id } = req.userInfo;

    // Create formidable instance (no 'new' keyword needed)
    const form = formidable();

    // Load Cloudinary credentials
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
      secure: true,
    });

    // Parse the form using a promise
    const parsedForm = () =>
      new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          resolve({ fields, files });
        });
      });

    const { fields, files } = await parsedForm();

    let allImages = [];

    // Handle single or multiple images
    const images = Array.isArray(files.images) ? files.images : [files.images];

    for (let i = 0; i < images.length; i++) {
      const { url } = await cloudinary.uploader.upload(images[i].filepath, {
        folder: "news",
      });
      allImages.push({ writerId: id, url });
    }

    const image = await imageModel.insertMany(allImages);
    return res.status(200).json({
      images: image,
      message: "Images added successfull",
    });
  } catch (error) {
    // Useful for debugging
    res.status(500).json({
      status: "Failed",
      message: error.message || "Something went wrong",
    });
  }
};
module.exports = { addNews, getImages, addImages };
