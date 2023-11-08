const mongoose = require("mongoose");

const contactus = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: Number,
    required: true,
  },
  query: {
    type: String,
  },
});

const Contactus = mongoose.model("ContactUs", contactus);
module.exports = Contactus;
