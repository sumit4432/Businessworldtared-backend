const { default: mongoose } = require("mongoose");

const freightSchema = new mongoose.Schema({
  type: "object",
  properties: {
    freightMode: {
      type: "object",
      properties: {
        bySea: { type: "boolean" },
        byAir: { type: "boolean" },
      },
      required: ["bySea", "byAir"],
    },
    locationDetails: {
      type: "object",
      properties: {
        origin: { type: "string" },
        containerSize: { type: "string" },
        destination: { type: "string" },
      },
      required: ["origin", "containerSize", "destination"],
    },
    itemDetails: {
      type: "object",
      properties: {
        quantity: { type: "integer" },
        weight: { type: "number" },
        volume: { type: "number" },
      },
      required: ["quantity", "weight", "volume"],
    },
    shipmentType: {
      type: "object",
      properties: {
        fromIndia: { type: "boolean" },
        toIndia: { type: "boolean" },
      },
      required: ["fromIndia", "toIndia"],
    },
    otherDetails: {
      type: "object",
      properties: {
        shipmentDate: { type: "string", format: "date" },
        origin: { type: "string" },
        cargoStatus: { type: "string" },
        commodityDetails: { type: "string" },
      },
      required: ["shipmentDate", "origin", "cargoStatus", "commodityDetails"],
    },
    paymentDetails: {
      type: "object",
      properties: {
        quotationLastDay: { type: "string", format: "date" },
        statusDetails: { type: "string" },
        paymentMethods: {
          type: "array",
          items: { type: "string" },
        },
        aimingFreight: { type: "number" },
        transitTimeRequired: { type: "integer" },
      },
      required: [
        "quotationLastDay",
        "statusDetails",
        "paymentMethods",
        "aimingFreight",
        "transitTimeRequired",
      ],
    },
  },
  required: [
    "freightMode",
    "locationDetails",
    "itemDetails",
    "shipmentType",
    "otherDetails",
    "paymentDetails",
  ],
});

// Create a model using the schema
const Freight = mongoose.model("Freight", freightSchema);

module.exports = Freight;
