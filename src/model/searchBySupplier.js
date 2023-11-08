const { mongoose } = require("mongoose");

const searchBySupplierSchema = new mongoose.Schema(
  {
    products: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },

    producctsWithPrice: {
      type: Boolean,
      required: true,
    },

    type: {
      type: String,
      enum: ["Wholesaler", "Manufacturer", "Retailer", "Exporter", "All"],
      required: true,
    },
    searchType: {
      type: String,
      enum: ["product", "company"],
      required: true,
    },
    enterProductsServices: {
      type: String,
    },
    enterCompanyName: {
      type: String,
    },
    showSuppliersFromCity: {
      type: String,
    },
    showSuppliersDealingInCity: {
      type: String,
    },
    showProducts: {
      type: String,
      enum: ["With Price", "All Products"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.module("Supplier", searchBySupplierSchema);
