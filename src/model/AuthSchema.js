const moment = require("moment-timezone");
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String,
  role: {
    type: String,
    enum: ["seller", "buyer", "other"],
    default: "buyer",
  },
  state: String,
  city: String,
  createdAt: {
    type: String,
    default: () => moment.tz("Asia/Kolkata").format("YYYY-MM-DD hh:mm A"),
  },
});

module.exports = mongoose.model("User", userSchema);
