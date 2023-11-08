const slugify = require("slugify");
const fs = require("fs");
const ContactProfile = require("../model/contactprofileSchema");
const Product = require("../model/productSchema");
// const multer = require("multer");

// Set up multer storage configuration
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// // Create the multer instance
// const upload = multer({ storage: storage });

// Fetch data of contact profile to admin panel

exports.ContactProfineData = async (req, res) => {
  try {
    const FetchData = await ContactProfile.find();
    if (FetchData) {
      res.status(201).json({ FetchData });
    } else {
      res.status(400).json({ msg: "Not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch data of contact profile by id to admin panel

exports.getContactProfileById = async (req, res) => {
  try {
    const contactProfile = await ContactProfile.findById(req.params.id);
    if (contactProfile) {
      res.status(200).json({ contactProfile });
    } else {
      res.status(404).json({ msg: "Contact profile not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create data of contact profile to admin panel// Adjust the path as needed

exports.createContactProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Check if a profile already exists for the user
    const existingProfile = await ContactProfile.findOne({ userId });
    if (existingProfile) {
      return res
        .status(400)
        .json({ success: false, error: "Profile already exists" });
    }

    const {
      firstname,
      lastName,
      companyname,
      businessPartnerSince,
      packageType,
      country,
      state,
      city,
      address,
      landmark,
      zipcode,
      phone,
      email,
      Altphone,
      Altemail,
      YearofEst,
      BusinessType,
      ownershiptype,
      employeeStrength,
      annualturnover,
      facebooklink,
      instagramlink,
      linkedinlink,
      company_des,
      ifscCode,
      bankName,
      AccNumb,
      accType,
      accountManager,
    } = req.body;

    // Process the uploaded images and store their filenames
    const images = req.files.map((file) => ({ img: file.filename }));

    const newContactProfile = new ContactProfile({
      userId,
      images,
      firstname,
      lastName,
      companyname,
      businessPartnerSince,
      packageType,
      country,
      state,
      city,
      address,
      landmark,
      zipcode,
      phone,
      email,
      Altphone,
      Altemail,
      YearofEst,
      BusinessType,
      ownershiptype,
      employeeStrength,
      annualturnover,
      facebooklink,
      instagramlink,
      linkedinlink,
      company_des,
      ifscCode,
      bankName,
      AccNumb,
      accType,
      accountManager,
    });

    const savedContactProfile = await newContactProfile.save();

    res.status(201).json({ success: true, data: savedContactProfile });
  } catch (error) {
    console.error("Error creating contact profile:", error);

    // Delete uploaded files in case of an error
    req.files.forEach((file) => {
      fs.unlinkSync(`uploads/${file.filename}`);
    });

    res
      .status(500)
      .json({ success: false, error: "Error creating contact profile" });
  }
};

// Update contact profile
exports.updateProfileById = async (req, res) => {
  const profileId = req.params.id;
  const updatedData = req.body;
  try {
    const updatedProfile = await ContactProfile.findByIdAndUpdate(
      profileId,
      updatedData,
      { new: true }
    );

    console.log("Updated Profile:", updatedProfile);

    if (updatedProfile) {
      res.status(200).json({ data: updatedProfile });
    } else {
      res.status(404).json({ msg: "Contact profile not found" });
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: error.message });
  }
};
// Delete contact profile
exports.deleteContactProfile = async (req, res) => {
  try {
    const id = req.params.id;

    const deleteContactProfile = await ContactProfile.findByIdAndDelete(id);
    if (deleteContactProfile) {
      res
        .status(200)
        .json({ data: deleteContactProfile, msg: "Profile deleted" });
    } else {
      res.status(404).json({ msg: "Not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserData = async (req, res) => {
  const userName = req.params.userData; // Correct the parameter name

  try {
    const profile = await ContactProfile.findOne({ userName });
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const products = await Product.find({ userId: profile.userId });

    res.json({ profile, products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
