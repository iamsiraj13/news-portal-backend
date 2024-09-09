const mongoose = require("mongoose");

const { Schema, model } = mongoose;
const { ObjectId } = mongoose.Schema.Types;

const authSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
    select: false,
  },
  role: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    require: true,
  },
  category: {
    type: String,
    require: true,
  },
});

const authModel = model("Auth", authSchema);
module.exports = authModel;
