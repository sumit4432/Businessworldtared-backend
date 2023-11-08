const moment = require("moment-timezone");
const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String,
  role: {
    type: String,
    enum: ["superAdmin", "", "subSupaerAdmin", "subAdmin"],
  },
  createdAt: {
    type: String,
    default: () => moment.tz("Asia/Kolkata").format("YYYY-MM-DD hh:mm A"),
  },
});

module.exports = mongoose.model("UserAdmin", adminSchema);
