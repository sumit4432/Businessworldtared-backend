const jwt = require("jsonwebtoken");
const Catalogue = require("../model/catalogSchema");
const User = require("../model/AuthSchema");
const fs = require("fs");
const path = require("path");
const ContactProfile = require("../model/contactprofileSchema");
const Product = require("../model/productSchema");

exports.createCataLog = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    const user = await User.findById(userId);
    if (user.role !== "seller") {
      return res.status(403).json({
        success: false,
        error: "Only sellers are allowed to create catalog entries.",
      });
    }
    const existingCatalog = await Catalogue.findOne({ userId });

    if (existingCatalog) {
      return res.status(400).json({
        success: false,
        error:
          "User already has a catalog. Update the existing catalog if needed.",
      });
    }
    const { companyDesc, web_url, product } = req.body;
    const userProfile = await User.findById(userId).select("-password");
    const contactProfile = await ContactProfile.findOne({ userId });

    if (!contactProfile) {
      console.log("No contact profile found for user:", userId);
    }
    const userProducts = await Catalogue.find({ userId });
    const imageUrls = (req.files["images"] || []).map((file) => {
      return `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
    });
    const videoUrls = (req.files["videos"] || []).map((file) => {
      return `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
    });
    const newCataLog = await Catalogue.create({
      images: imageUrls,
      videos: videoUrls,
      companyDesc,
      web_url,
      product,
      userId: userId,
    });
    const savedCatalog = await newCataLog.save();
    const responseData = {
      ...savedCatalog._doc,
      images: imageUrls,
      videos: videoUrls,
      userProfile,
      userProducts,
      contactProfile,
    };

    res.status(201).json({ success: true, data: responseData });
  } catch (error) {
    console.error("Error creating catalog:", error);
    if (req.files && req.files["images"]) {
      req.files["images"].forEach((file) => {
        const filePath = path.join(__dirname, "..", "uploads", file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }
    if (req.files && req.files["videos"]) {
      req.files["videos"].forEach((file) => {
        const filePath = path.join(__dirname, "..", "uploads", file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllCatalogs = async (req, res) => {
  try {
    const catalogs = await Catalogue.find();
    if (!catalogs || catalogs.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No catalogs found" });
    }
    const responseData = [];

    for (const catalog of catalogs) {
      const userProfile = await User.findById(catalog.userId).select(
        "-password"
      );

      const contactProfile = await ContactProfile.findOne({
        userId: catalog.userId,
      });

      if (!contactProfile) {
        console.log("No contact profile found for user:", catalog.userId);
      }

      const imageUrls = catalog.images
        ? catalog.images.map((image) => {
            return `${req.protocol}://${req.get("host")}/uploads/${image.img}`;
          })
        : [];

      const userProducts = await Product.find({ userId: catalog.userId });

      const catalogData = {
        ...catalog._doc,
        images: imageUrls,
        userProfile,
        userProducts,
        contactProfile,
      };

      responseData.push(catalogData);
    }

    res.status(200).json({ success: true, data: responseData });
  } catch (error) {
    console.error("Error getting all catalogs:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getCatalogById = async (req, res) => {
  try {
    const catalogId = req.params.id;
    console.log("Catalog ID:", catalogId); // Add this line
    const catalog = await Catalogue.findById(catalogId);

    if (!catalog) {
      return res
        .status(404)
        .json({ success: false, message: "Catalog not found" });
    }
    const userProfile = await User.findById(catalog.userId).select("-password");

    const contactProfile = await ContactProfile.findOne({
      userId: catalog.userId,
    });

    if (!contactProfile) {
      console.log("No contact profile found for user:", catalog.userId);
    }

    const imageUrls = catalog.images
      ? catalog.images.map((image) => {
          return `${req.protocol}://${req.get("host")}/uploads/${image.img}`;
        })
      : [];
    const userProducts = await Product.find({ userId: catalog.userId });
    const responseData = {
      ...catalog._doc,
      images: imageUrls,
      userProfile,
      userProducts,
      contactProfile,
    };

    res.status(200).json({ success: true, data: responseData });
  } catch (error) {
    console.error("Error getting catalog by ID:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateCatalog = async (req, res) => {
  try {
    const catalogId = req.params.id;
    const updatedData = req.body;
    const updatedCatalog = await Catalogue.findByIdAndUpdate(
      catalogId,
      updatedData,
      { new: true }
    );

    if (!updatedCatalog) {
      return res
        .status(404)
        .json({ success: false, message: "Catalog not found" });
    }

    res.status(200).json({ success: true, data: updatedCatalog });
  } catch (error) {
    console.error("Error updating catalog:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteCatalog = async (req, res) => {
  try {
    const catalogId = req.params.id;
    const deletedCatalog = await Catalogue.findByIdAndDelete(catalogId);

    if (!deletedCatalog) {
      return res
        .status(404)
        .json({ success: false, message: "Catalog not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Catalog deleted successfully" });
  } catch (error) {
    console.error("Error deleting catalog:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
