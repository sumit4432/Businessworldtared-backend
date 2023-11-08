const mongoose = require("mongoose");

const CertificateSchema = new mongoose.Schema({
  certificate: {
    type: String,
    // required: true,
  },
  name: {
    type: String,
    // required: true,
  },
  email: {
    type: String,
    // required: true,
  },
  phone: {
    type: Number,
    // required: true,
  },
  companyName: {
    type: String,
    // required: true,
  },
  message: {
    type: String,
    // required: true,
  },
  createdAt: {
    type: Date,
  },
});

const Certificate = mongoose.model("Certificate", CertificateSchema);
module.exports = Certificate;
