const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema({
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
});

const Inquiries = mongoose.model("Inquiries", inquirySchema);

module.exports = Inquiries;
