const mongoose = require("mongoose");

const callbackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },

  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
  },
});

const Callback = mongoose.model("Callback", callbackSchema);
module.exports = Callback;
