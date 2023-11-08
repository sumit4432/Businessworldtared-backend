const express = require("express");
const searchSuppliers = require("../controller/searchBySupplier");
const router = express.Router();

router.get("/searchBySUpplier", searchSuppliers);
