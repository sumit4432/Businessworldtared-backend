const mongoose = require("mongoose");
const User = require("./AuthSchema");

const contactProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
  },
  images: [{ img: { type: String } }],
  firstname: {
    type: String,
  },
  lastName: {
    type: String,
  },
  companyname: {
    type: String,
  },
  businessPartnerSince: {
    type: String,
  },
  packageType: {
    type: String,
  },
  country: {
    type: String,
  },
  state: {
    type: String,
  },
  city: {
    type: String,
  },
  address: {
    type: String,
  },
  landmark: {
    type: String,
  },
  zipcode: {
    type: String,
  },
  phone: {
    type: Number,
  },
  email: {
    type: String,
  },
  Altphone: {
    type: Number,
  },
  Altemail: {
    type: String,
  },
  YearofEst: {
    type: Number,
  },
  BusinessType: {
    type: String,
  },
  ownershiptype: {
    type: String,
  },
  employeeStrength: {
    type: String,
  },
  annualturnover: {
    type: String,
  },
  facebooklink: {
    type: String,
  },
  instagramlink: {
    type: String,
  },
  linkedinlink: {
    type: String,
  },
  company_des: {
    type: String,
  },
  ifscCode: {
    type: String,
  },
  bankName: {
    type: String,
  },
  AccNumb: {
    type: String,
  },
  accType: {
    type: String,
  },
  accountManager: {
    type: String,
  },
  userName: {
    type: String,
    unique: true,
  },
});

contactProfileSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("companyname")) {
    const count = await this.constructor.countDocuments({
      companyname: this.companyname,
    });
    const serialNumber = (count + 1).toString().padStart(3, "0");

    const words = this.companyname.split(" ");
    const initials = words.map((word) => word[0].toUpperCase()).join("");

    this.userName = `BWT_${initials}_${serialNumber}`;
  }
  next();
});

const ContactProfile = mongoose.model("ContactProfile", contactProfileSchema);

module.exports = ContactProfile;
