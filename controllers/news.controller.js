const { formidable } = require("formidable");
const cloudinary = require("cloudinary").v2;
const moment = require("moment");
const util = require("util");

const newsModel = require("../models/news.model");
const imageModel = require("../models/gallery.model");
const { Types } = require("mongoose");

const addNews = async (req, res) => {
  const { id, name, category } = req.userInfo || {};

  const form = formidable({});

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
      date: moment().format("LL"), // Date format
      writerName: name,
      image: url,
    });

    res.status(201).json({ message: "News created successfully", news });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: "Unable to create news, Please try again later.",
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

const getDashboardNews = async (req, res) => {
  try {
    const { id, role } = req.userInfo;

    if (role === "admin") {
      const news = await newsModel.find({}).sort({ createdAt: -1 });
      return res.status(200).json({
        news,
      });
    } else {
      const news = await newsModel
        .find({ writerId: new Types.ObjectId(id) })
        .sort({ createdAt: -1 });
      return res.status(200).json({
        news,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "Failed",
      message: "Unable to get news, Please try again later.",
    });
  }
};

const getDashboardNewsById = async (req, res) => {
  try {
    const { newsId } = req.params;
    const news = await newsModel.findById(newsId);
    return res.status(200).json({
      news,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "Failed",
      message: "Unable to get news, Please try again later.",
    });
  }
};
const updateNews = async (req, res) => {
  const { newsId } = req.params;

  // Cloudinary configuration
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true,
  });

  try {
    // Create a new formidable form instance
    const form = formidable({});

    // Parse the form with a callback
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          status: "Failed",
          message: "Error parsing form data.",
        });
      }
      // console.log(fields);
      // console.log(files);

      let url = fields.old_image[0];

      if (Object.keys(files).length > 0) {
        console.log("url" + url);

        // Handle old image deletion from Cloudinary
        const splitImage = url.split("/");
        console.log("splitImage" + splitImage);
        const imageName = splitImage[splitImage.length - 1];
        const publicId = imageName.split(".")[0];
        await cloudinary.uploader.destroy(publicId);

        // Upload new image to Cloudinary
        const data = await cloudinary.uploader.upload(
          files.new_image[0].filepath,
          {
            folder: "news",
          }
        );
        url = data.url;
      }

      // Update news with new fields and image URL
      const news = await newsModel.findByIdAndUpdate(
        newsId,
        {
          title: fields.title[0],
          slug: fields.title[0].split(" ").join("-"),
          description: fields.description[0],
          image: url,
        },
        { new: true }
      );

      return res.status(200).json({
        news,
        message: "News updated successfully",
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Failed",
      message: "Unable to update news, Please try again later.",
    });
  }
};
module.exports = {
  addNews,
  getImages,
  addImages,
  getDashboardNews,
  getDashboardNewsById,
  updateNews,
};
