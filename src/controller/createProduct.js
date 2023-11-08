const shortid = require("shortid");
const slugify = require("slugify");
const Category = require("../model/category");
const ContactProfile = require("../model/contactprofileSchema");
const Product = require("../model/productSchema");
const mongoose = require("mongoose");
exports.CreateProduct = async (req, res) => {
  const {
    name,
    price,
    quantity,
    berifDesc,
    KeyChar,
    description,
    businessType,
    businessName,
    location,
    maxOrder,
    minOrder,
    categoryId,
    categoryName,
  } = req.body;

  const productPictures = req.files.map((file) => ({ img: file.path }));

  const authUserId = req.user.userId; // Use the authenticated user's ID

  try {
    let category;
    // Check if categoryId is provided
    if (categoryId) {
      // Use the provided categoryId directly
      category = categoryId;
    } else if (categoryName) {
      // If categoryName is provided, find the category by name
      const categoryObject = await Category.findOne({ name: categoryName });
      if (!categoryObject) {
        return res.status(404).json({ error: "Category not found." });
      }
      category = categoryObject._id; // Get the category ID
    } else {
      return res
        .status(400)
        .json({ error: "Either categoryId or categoryName is required." });
    }

    // Fetch the contact profile associated with the authenticated user
    const contactProfile = await ContactProfile.findOne({ userId: authUserId });

    if (!contactProfile) {
      return res
        .status(404)
        .json({ error: "Contact profile not found for the user." });
    }

    const product = new Product({
      userId: authUserId,
      name,
      slug: slugify(name),
      price,
      quantity,
      berifDesc,
      KeyChar,
      description,
      productPictures,
      businessType,
      businessName,
      location,
      maxOrder,
      minOrder,
      category, // Use the category variable
      contactProfile: contactProfile._id, // Associate the contact profile ID
    });

    // Save the product
    const savedProduct = await product.save();

    // Send the product and contact profile data in the response
    res.status(201).json({ product: savedProduct, contactProfile });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.GetAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ error: "Server error." });
  }
};

exports.GetProductById = async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await Product.findById(productId).populate(
      "contactProfile"
    );

    if (!product) {
      return handleError(res, 404, "Product not found.");
    }

    const userProfile = product.contactProfile;

    res.status(200).json({ product, userProfile });
  } catch (error) {
    handleError(res, 500, "Server error.");
  }
};

// Delete a specific product by ID
exports.DeleteProductById = async (req, res) => {
  const productId = req.params.id; // Assuming the product ID is passed as a URL parameter

  try {
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found." });
    }
    res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error." });
  }
};

// Update a specific product by ID

exports.UpdateProductById = async (req, res) => {
  const productId = req.params.id;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      req.body,
      { new: true }
    );

    if (!updatedProduct) {
      return handleError(res, 404, "Product not found.");
    }

    res.status(200).json({ product: updatedProduct });
  } catch (error) {
    handleError(res, 500, "Server error.");
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const searchValue = req.query.value;
    const searchType = req.query.type;

    if (!searchValue || !searchType) {
      res.status(400).json({ error: "Both value and type are required" });
      return;
    }

    let results = [];
    if (searchType === "product") {
      results = await productschema.find({
        name: { $regex: searchValue, $options: "i" },
      });
    } else if (searchType === "category") {
      const category = await Category.findOne({ name: searchValue });

      if (category) {
        results = await productschema.find({ category: category._id });
      }
    }
    if (results.length === 0) {
      res.status(404).json({ message: "No matching results found" });
    } else {
      // Populate the category name for each product
      const populatedResults = await Promise.all(
        results.map(async (product) => {
          const populatedProduct = product.toObject();
          if (product.category) {
            const category = await Category.findById(product.category);
            if (category) {
              populatedProduct.category = category.name;
            }
          }
          return populatedProduct;
        })
      );

      res.json({ results: populatedResults });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.searchProductsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const foundProducts = await Product.find({ category: categoryId });
    res.json(foundProducts);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
exports.searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await Product.find({
      $or: [{ name: { $regex: keyword, $options: "i" } }],
    }).select("-photo");
    res.status(201).json({ results });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ success: false, message: "error in search product API", error });
  }
};
