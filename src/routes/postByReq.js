const express = require("express");
const { createPostByRequirement } = require("../controller/PostByRequirement");
const { getAllPost } = require("../productReController/PostByRequirement");

const multer = require("multer");

const router = express.Router();
const { requiresignin } = require("../middleware/middleware");
const fs = require("fs");
const {
  createInquiry,
  getAllInquiries,
  updateInquiry,
  deleteInquiry,
  getInquiryById,
} = require("../controller/Inquires");
const {
  createCataLog,
  getAllCatalogs,
  getCatalogById,
  updateCatalog,
  deleteCatalog,
} = require("../controller/Catalogue");
const {
  createFat,
  getAllFat,
  getFatById,
  updateFatById,
  deleteFatById,
} = require("../controller/FAT");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype.startsWith("video/")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
});
router.post("/postbyrequirement", createPostByRequirement);
router.get("/postbyrequirement", getAllPost);

//***************************Inquires******************** */
router.post("/createInquries", createInquiry);
router.get("/getEnquries", getAllInquiries);
router.get("/getEnquries/:id", getInquiryById);
router.put("/updateEnquries/:id", updateInquiry);
router.delete("/deleteEnquries/:id", deleteInquiry);

// **********************catalogue**************************
router.post(
  "/createCat",
  requiresignin,
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "videos", maxCount: 10 },
  ]),
  createCataLog
);

router.get("/getCatalogue", getAllCatalogs);
router.get("/getCatalogue/:id", getCatalogById);
router.put("/updateCatalogue/:id", updateCatalog);
router.delete("/deleteCatalogue/:id", deleteCatalog);

// ****************FREETRADE AGREEMENTS************************

router.post("/createfta", createFat);
router.get("/getAllFta", getAllFat);
router.get("/fta/:id", getFatById);
router.put("/fta/:id", updateFatById);
router.delete("/fta/:id", deleteFatById);
module.exports = router;
