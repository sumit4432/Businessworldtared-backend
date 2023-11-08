const express = require("express");
const router = express.Router();
const {
  Contatctprofile,
  GetUserbyLogin,
  getCategories,
  SubmitForm,
  SetMiddlewareSubmission,
  GetuserFormDetail,
  addCategory,
  getCategoryById,
  deleteCategoryById,
  deleteSubcategoryById,
  getParentCategoryById,
  updateCategoryById,
  deleteCategoryImagesMiddleware,
} = require("../controller/productController");
const {
  createPostByRequirement,
  getForms,
} = require("../controller/PostByRequirement");

//user routes
const {
  Signup,
  Signin,
  updateRole,
  Getalluser,
  logout,
  register,
  signIn,
  deleteUser,
  getUserById,
  updateUser,
} = require("../controller/Auth");

const multer = require("multer");
const shortid = require("shortid");
const path = require("path");
const {
  AdminMiddleWare,
  requiresignin,
  UserMiddleWare,
  fetchContactProfile,
} = require("../middleware/middleware");
const {
  createCallback,
  updateCallback,
  deleteCallback,
  getCallbacks,
  getCallbackById,
} = require("../controller/callback");
const { createContactus } = require("../controller/contactus");
const { newsletter } = require("../controller/newsletter");
const {
  CreateProduct,
  UpdateProductById,
  GetAllProducts,
  DeleteProductById,
  searchProductController,
  GetProductById,
  updateProduct,
} = require("../controller/createProduct");
const Freight = require("../model/freightSchema");

// const PostByRequirement = require("../model/PostByRequirement");

//controllerProduct storege
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/"); // Specify the correct path to the 'uploads/' directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// File upload middleware
// const upload = multer({ storage: storage });

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(path.dirname(__dirname), "uploads"));
//   },
//   filename: function (req, file, cb) {
//     cb(null, shortid.generate() + "-" + file.originalname);
//   },
// });

const upload = multer({ storage });

//************************catgroy route****************** */

router.post("/createcategory", addCategory);
router.get("/getcategory", getCategories);
router.get("/getcategory/:id", getCategoryById);
router.put("/category/:id", updateCategoryById);
router.delete("/deletecategory/:id", deleteCategoryById);
router.delete("/subcategory/:subcategoryId", deleteSubcategoryById);
router.delete(
  "/categories/:id",
  deleteCategoryImagesMiddleware,
  deleteCategoryById
);

//  *******************product Route*********************************

router.post(
  "/createProduct",
  requiresignin, // Authenticate the user before proceeding
  fetchContactProfile,
  upload.array("productPictures"),
  CreateProduct
);
router.put("/updatePro/:id", UpdateProductById);
router.get("/getallproducts", GetAllProducts);
router.get("/getsingleproduct/:id", GetProductById);
router.delete("/deleteproduct/:id", DeleteProductById);
// router.get("/products/:name", searchProductsByCategory);
router.get("/search/:keyword", searchProductController);

//******************************contactProfile ****************************** */

// contacctprofile routes

//get prodducts through id
// router.route("/readUserById/:id").get(readUserById);

// router.route("/deleteuser/:id").delete(
//   requiresignin,
//   checkRoles(""),
//   deleteuser
// );
router.post("/newsletter", newsletter);
router.post("/contactus", createContactus);

router.post("/signup", register);
router.post("/signin", signIn);
router.post("/logout", logout);
router.get("/Getalluser", Getalluser);
router.delete("/deleteUser/:userId", deleteUser);
router.get("/getById/:userId", getUserById);
router.put("/updateUser/:userId", updateUser);

// ************************callback route***********************

router.post("/callback", createCallback);
router.get("/getCallback", getCallbacks);
router.get("/callbacks/:callbackId", getCallbackById);
router.put("/callbacks/:callbackId", updateCallback);
router.delete("/callbacks/:callbackId", deleteCallback);

router.put("/updateRole", updateRole);
router.get("/GetUserbyLogin", requiresignin, GetUserbyLogin);
router.post("/SubmitForm", requiresignin, SubmitForm);

router.get("/GetuserFormDetail", requiresignin, GetuserFormDetail);

router.get("/GetForms", getForms);

router.post("/createPostByRequirement", createPostByRequirement);

// Route to create a new freight object
router.post("/freight", async (req, res) => {
  try {
    const newFreight = new Freight(req.body);
    const savedFreight = await newFreight.save();
    res.status(201).json(savedFreight);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
