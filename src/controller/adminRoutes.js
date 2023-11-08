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
} = require("../controller/adminAuth");
const {
  requiresignin,
  UserMiddleWare,
  AdminMiddleWare,
} = require("../middleware/middleware");

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
router.post("/adminsignin", Signin);
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

module.exports = router;
