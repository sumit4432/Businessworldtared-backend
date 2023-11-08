const express = require("express");
const router = express.Router();
const {
  ContactProfineData,
  getContactProfileById,
  updateContactProfile,
  deleteContactProfile,
  createContactProfile,
  updateProfileById,
  getUserData,
} = require("../controller/AdminController");

const { checkRoles, updateRole } = require("../controller/Auth");
const {
  createUser,
  Adminrole,
  Signin,
  logout,
  Signup,
  getAllUserAdmins,
  getUserAdminById,
  updateUserAdminById,
  deleteUserAdminById,
} = require("../controller/adminAuth");
const {
  requiresignin,
  UserMiddleWare,
  AdminMiddleWare,
  authorizeEmailAndPhone,
} = require("../middleware/middleware");

const {
  createCertificateEnquiry,
  getCertificateEnquiry,
  getCertificateEnquiryById,
  deleteCertificateEnquiry,
} = require("../controller/CertificateController.js");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post("/adminsignup", Signup);
router.post("/adminsignin", authorizeEmailAndPhone, Signin);
router.get("/getAllAdmin", getAllUserAdmins);
router.get("/getAdmin/:id", getUserAdminById);
router.put("/adminUpdate/:id", updateUserAdminById);
router.delete("/delete/:id", deleteUserAdminById);

router.post("/logout", logout);
router.post("/profile", requiresignin, Adminrole, (req, res) => {
  res.status(201).json({ msg: "profile" });
});
router.get("/GetContactProfile", ContactProfineData);
router.get("/GetContactProfilebyId/:id", getContactProfileById);
router.get("/userIdata/:userName", getUserData);

router.post(
  "/createContactProfile",
  requiresignin,
  upload.array("images"),
  createContactProfile
);
router.put("/UpdateContactProfile/:id", updateProfileById);
router.delete("/deleteContactProfile/:id", deleteContactProfile);

router.post("/certificate", createCertificateEnquiry);
router.get("/certificates", getCertificateEnquiry);
router.get("/certificate/:id", getCertificateEnquiryById);
router.delete("/deletecertificate/:certificateId", deleteCertificateEnquiry);

module.exports = router;
