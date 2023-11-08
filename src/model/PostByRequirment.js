const express = require("express");
const mongoose = require("mongoose");

const PostBySchema = mongoose.Schema({
  // Name: {
  //   type: String,
  // },
  productName: {
    type: String,
  },
  quality: {
    type: String,
  },
  moq: {
    type: String,
  },

  sale: {
    type: String,
  },

  packaging: {
    type: String,
  },

  deliveryPlace: {
    type: String,
  },

  email: {
    type: String,
    required: true,
  },

  requirement: {
    type: String,
  },

  purpose: {
    type: String,
  },

  description: {
    type: String,
  },

  payment: {
    type: String,
  },

  phone: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },

  // approved: {
  //   type: Boolean,
  // },
});

const PostByRequirement = mongoose.model("PostByRequirement", PostBySchema);
module.exports = PostByRequirement;
