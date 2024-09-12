const mongoose = require("mongoose");

const { Schema, model } = mongoose;
const { ObjectId } = mongoose.Schema.Types;

const imagesSchema = new Schema(
  {
    writerId: {
      type: ObjectId,
      require: true,
      ref: "Auth",
    },
    url: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const imageModel = model("Image", imagesSchema);
module.exports = imageModel;
