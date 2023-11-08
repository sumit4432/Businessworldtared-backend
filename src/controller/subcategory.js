const multer = require("multer");

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "path/to/image/uploads"); // Replace with the actual path to store uploaded images
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = file.originalname.split(".").pop();
    cb(null, uniqueSuffix + "." + extension);
  },
});

// Create Multer upload instance
const upload = multer({ storage: storage });

exports.storeSubcategoryInParent = async (req, res, next) => {
  try {
    const { parentId } = req.body;

    // Check if parentId exists
    if (parentId) {
      const parentCategory = await Category.findById(parentId);

      if (parentCategory) {
        // Store the subcategory in the parent category
        const subcategory = { ...req.body, images: [] };

        // Handle file uploads
        upload.array("images")(req, res, async function (err) {
          if (err) {
            console.error(err);
            // Handle the error appropriately
            return next(err);
          }

          // Add uploaded file paths to subcategory
          req.files.forEach((file) => {
            subcategory.images.push({ img: file.path });
          });

          parentCategory.subcategories.push(subcategory);
          await parentCategory.save();

          next();
        });
      }
    } else {
      next();
    }
  } catch (error) {
    console.error(error);
    // Handle the error appropriately
    next(error);
  }
};

exports.updateSubcategoryByParentId = async (req, res, next) => {
  try {
    const { parentId, subcategoryId } = req.params;

    const parentCategory = await Category.findById(parentId);
    if (!parentCategory) {
      return res.status(404).json({ error: "Parent category not found" });
    }

    const subcategoryIndex = parentCategory.subcategories.findIndex(
      (sub) => sub._id.toString() === subcategoryId
    );

    if (subcategoryIndex === -1) {
      return res.status(404).json({ error: "Subcategory not found" });
    }

    const updatedSubcategory = {
      ...parentCategory.subcategories[subcategoryIndex],
      ...req.body,
    };

    parentCategory.subcategories[subcategoryIndex] = updatedSubcategory;
    await parentCategory.save();

    res.json(updatedSubcategory);
  } catch (error) {
    console.error(error);
    // Handle the error appropriately
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllSubcategories = async (req, res, next) => {
  try {
    const { parentId } = req.params;

    const parentCategory = await Category.findById(parentId);
    if (!parentCategory) {
      return res.status(404).json({ error: "Parent category not found" });
    }

    const subcategories = parentCategory.subcategories;
    res.json(subcategories);
  } catch (error) {
    console.error(error);
    // Handle the error appropriately
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteSubcategoryByParentId = async (req, res, next) => {
  try {
    const { parentId, subcategoryId } = req.params;

    const parentCategory = await Category.findById(parentId);
    if (!parentCategory) {
      return res.status(404).json({ error: "Parent category not found" });
    }

    const subcategoryIndex = parentCategory.subcategories.findIndex(
      (sub) => sub._id.toString() === subcategoryId
    );

    if (subcategoryIndex === -1) {
      return res.status(404).json({ error: "Subcategory not found" });
    }

    const deletedSubcategory = parentCategory.subcategories.splice(
      subcategoryIndex,
      1
    )[0];
    await parentCategory.save();

    res.json(deletedSubcategory);
  } catch (error) {
    console.error(error);
    // Handle the error appropriately
    res.status(500).json({ error: "Internal server error" });
  }
};
