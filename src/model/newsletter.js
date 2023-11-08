const mongoose = require("mongoose");
const newsletter = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const newsLater = mongoose.model("newletter", newsletter);
module.exports = newsLater;
