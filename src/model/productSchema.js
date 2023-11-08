const mongoose = require("mongoose");
const Category = require("./category");
const User = require("./AuthSchema");
const ContactProfile = require("./contactprofileSchema");

const productSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    keyChar: {
      type: String,
      set: function (value) {
        const lines = value.split(". ");
        const formattedLines = lines.map((line) => `- ${line}`);
        return formattedLines.join("\n");
      },
    },
    briefDesc: {
      type: String,
    },
    description: {
      type: String,
    },
    productPictures: [
      {
        img: { type: String },
      },
    ],
    businessType: {
      type: String,
    },
    businessName: {
      type: String,
    },
    location: {
      type: String,
    },
    maxOrder: {
      type: Number,
    },
    minOrder: {
      type: Number,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    contactProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ContactProfile",
      required: true,
    },
  },
  { timestamps: true }
);

// Add indexes for fields you frequently query on

productSchema.index({ userId: 1, category: 1 });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
