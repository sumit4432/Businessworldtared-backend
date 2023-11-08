const mongoose = require("mongoose");
const CategoryModal = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    parentId: {
      type: String,
    },

    images: [{ img: { type: String } }],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Category = new mongoose.model("AllCategory", CategoryModal);

module.exports = Category;
