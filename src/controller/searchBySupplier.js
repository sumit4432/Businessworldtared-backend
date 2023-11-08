// supplierMiddleware.js
const Supplier = require("../model/searchBySupplier");
const searchSuppliers = async (req, res, next) => {
  try {
    const {
      searchType,
      product,
      company,
      city,
      showSuppliersFromCity,
      lookingFor,
      showProductsWithPrice,
    } = req.query;

    const query = {};

    // Search by product
    if (searchType === "product" && product) {
      query.products = { $regex: product, $options: "i" };
    }

    // Search by company
    if (searchType === "company" && company) {
      query.company = { $regex: company, $options: "i" };
    }

    // Search by city
    if (city) {
      query.city = { $regex: city, $options: "i" };
    }

    // Show suppliers only from the city
    if (showSuppliersFromCity === "true") {
      query.city = city;
    }

    // Looking for specific types
    if (lookingFor && lookingFor !== "All") {
      query.type = lookingFor;
    }

    // Show products with price
    if (showProductsWithPrice === "true") {
      query.productsWithPrice = true;
    }

    const suppliers = await Supplier.find(query);
    req.suppliers = suppliers;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = searchSuppliers;
