const mongoose = require("mongoose");

const { Schema, model } = mongoose;
const { ObjectId } = mongoose.Schema.Types;

const newsSchema = new Schema(
  {
    writerId: {
      type: ObjectId,
      require: true,
      ref: "Auth",
    },
    writerName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "pending",
    },
    count: {
      type: String,
      default: 0,
    },
  },
  { timestamps: true }
);

const newsModel = model("News", newsSchema);
module.exports = newsModel;
