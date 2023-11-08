const moment = require("moment-timezone");
const mongoose = require("mongoose");
const fatSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  campanyName: String,
  iec: String,
  gst: String,
  address: String,
  selectionType: String,
  comapnyPan: String,
  timePeriod: String,
  yearOfEst: String,
  createdAt: {
    type: String,
    default: () => moment.tz("Asia/Kolkata").format("YYYY-MM-DD hh:mm A"),
  },
});

module.exports = mongoose.model("Fat", fatSchema);
