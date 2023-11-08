const userSchema = require("../model/AuthSchema");
const Category = require("../model/category");
const multer = require("multer");
const path = require("path");
const slug = require("slug");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const ContactProfile = require("../model/contactprofileSchema");
// seller pannel
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/"); // Specify the correct path to the 'uploads/' directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// File upload middleware
const upload = multer({ storage: storage });

function createCategories(categories, parentId = null) {
  const categoryList = [];
  let category;

  if (parentId == null) {
    category = categories.filter((cat) => !cat.parentId);
  } else {
    category = categories.filter(
      (cat) => cat.parentId && cat.parentId.toString() === parentId.toString()
    );
  }

  for (let cate of category) {
    const categoryObj = {
      _id: cate._id,
      name: cate.name,
      slug: cate.slug,
      images: cate.images,
      parentId: cate.parentId,
      children: createCategories(categories, cate._id),
    };

    categoryList.push(categoryObj);
  }

  return categoryList;
}

exports.addCategory = async (req, res) => {
  try {
    upload.array("images", 5)(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred during upload
        return res.status(400).json({ error: "Error uploading images" });
      } else if (err) {
        // An unknown error occurred during upload
        return res.status(400).json({ error: err.message });
      }

      const { name, parentId } = req.body;

      // Validate the name property
      if (!name || typeof name !== "string") {
        return res.status(400).json({ error: "Invalid name" });
      }

      const slugValue = slug(name);

      const images = req.files.map((file) => ({ img: file.path }));

      const categoryObj = {
        name,
        slug: slugValue,
        parentId,
        images,
      };

      const category = new Category(categoryObj);
      const savedCategory = await category.save();
      res.status(201).json({ category: savedCategory });
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});

    const categoriesList = createCategories(categories);

    return res.status(200).json(categoriesList);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

//*********************get categoryby Id******************** */
exports.getCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    const subcategories = await Category.find({ parentId: categoryId });

    res.status(200).json({ category, subcategories });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.updateCategoryById = async (req, res) => {
  try {
    upload.fields([
      { name: "name", maxCount: 1 },
      { name: "images", maxCount: 5 },
    ])(req, res, async (err) => {
      if (err) {
        console.error("Error parsing form data:", err);
        return res.status(400).json({ error: "Error parsing form data" });
      }
      const categoryId = req.params.id;
      const { name } = req.body;
      if (!name || typeof name !== "string" || name.trim().length === 0) {
        console.error("Invalid name:", name);
        return res.status(400).json({ error: "Invalid name" });
      }
      let images = req.files["images"].map((file) => ({ img: file.path }));
      const category = await Category.findOne({ _id: categoryId });
      category.name = name;
      category.images.push(...images);
      const updatedCategory = await category.save();

      console.log("Category updated successfully:", updatedCategory);

      res.status(200).json({ category: updatedCategory });
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(400).json({ error: error.message });
  }
};

// Delete category by ID
exports.deleteCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const deletedCategory = await Category.findOneAndDelete({
      _id: categoryId,
    });

    if (!deletedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete images inside category
exports.deleteCategoryImagesMiddleware = async (req, res, next) => {
  try {
    const categoryId = req.params.id;

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    if (category.images && category.images.length > 0) {
      for (const image of category.images) {
        const imagePath = path.join(__dirname, "..", image.img);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          console.log(`Image deleted for category ID: ${categoryId}`);
        }
      }
    }

    next();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteSubcategoryById = async (req, res) => {
  try {
    const subcategoryId = req.params.id; // Assuming the subcategory ID is provided in the request parameters

    const subcategory = await Category.findById(subcategoryId);

    if (!subcategory) {
      return res.status(404).json({ error: "Subcategory not found" });
    }

    await subcategory.remove();

    res.status(200).json({ message: "Subcategory deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getParentCategoryById = async (req, res) => {
  try {
    const subcategoryId = req.params.id; // Assuming the subcategory ID is provided in the request parameters

    const subcategory = await Category.findById(subcategoryId);

    if (!subcategory) {
      return res.status(404).json({ error: "Subcategory not found" });
    }

    const parentCategory = await Category.findById(subcategory.parentId);

    if (!parentCategory) {
      return res.status(404).json({ error: "Parent category not found" });
    }

    res.status(200).json({ parentCategory });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// contacteProfile data
exports.Contatctprofile = async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await userSchema.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const {
      firstname,
      image,
      lastName,
      companyname,
      country,
      state,
      city,
      address,
      landmark,
      zipcode,
      phone,
      email,
      Altphone,
      Altemail,
      YearofEst,
      BusinessType,
      ownershiptype,
      employeeStrength,
      annualturnover,
      facebooklink,
      instagramlink,
      linkedinlink,
      company_des,
      ifscCode,
      bankName,
      AccNumb,
      accType,
    } = req.body;

    const updatedata = {
      firstname,
      image,
      lastName,
      companyname,
      country,
      state,
      city,
      address,
      landmark,
      zipcode,
      phone,
      email,
      Altphone,
      Altemail,
      YearofEst,
      BusinessType,
      ownershiptype,
      employeeStrength,
      annualturnover,
      facebooklink,
      instagramlink,
      linkedinlink,
      company_des,
      ifscCode,
      bankName,
      AccNumb,
      userId,
      accType,
    };

    const data = await ContactProfile.findOneAndUpdate(
      { userId: userId },
      updatedata,
      { new: true, upsert: true }
    );

    data.save();
    res
      .status(201)
      .json({ message: "Contact profile updated successfully", data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// /update contact prfoiel dattataa
exports.GetUserbyLogin = async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    res.status(401).json({ login: "please login" });
  } else {
    try {
      const data = await contactprofile.findOne({ userId: userId });
      if (data) {
        res.status(200).json({ data });
      } else {
        res.status(404).json({ msg: "User not found" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

//two ways to handle the formdata middleware

//middleware here seller form middleware

exports.SetMiddlewareSubmission = async (req, res, nxt) => {
  const userId = req.user._id;
  try {
    const user = await formdata.findOne({ userId }).exec();
    if (user) {
      nxt();
    } else {
      res.status(404).json({ msg: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.SubmitForm = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await userSchema.findById(userId);
    if (!user) {
      res.status(404).json({ msg: "User not found" });
    } else {
      const { name, gstnumb, email } = req.body;

      const data = new formdata({ name, gstnumb, email, userId });
      await data.save();

      res.status(201).json({ success: true, data });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.GetuserFormDetail = async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    res.status(401).json({ login: "please login" });
  } else {
    try {
      const data = await formdata.findOne({ userINFO: userId });
      if (data) {
        res.status(200).json({ data });
      } else {
        res.status(404).json({ msg: "User not found" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};
