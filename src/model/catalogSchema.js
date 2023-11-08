const mongoose = require("mongoose");
const ContactProfile = require("./contactprofileSchema");
const User = require("./AuthSchema");

const catatLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },
    companyDesc: {
      type: String,
    },
    web_url: {
      type: String,
    },
    product: {
      type: String,
    },

    images: [
      {
        type: String,
      },
    ],
    videos: [
      {
        type: String,
      },
    ],
    contactProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: ContactProfile,
    },
  },
  { timestamps: true }
);

const Catalogue = mongoose.model("Catalogue", catatLogSchema);

module.exports = Catalogue;
