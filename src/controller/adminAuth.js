const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserAdmin = require("../model/AdminSchema");
exports.Signup = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    // Check if the email is already registered
    const existingUser = await UserAdmin.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }
    // Hash the password
    const saltRounds = 10; // Number of salt rounds for bcrypt
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user
    const user = new UserAdmin({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
    });
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
exports.logout = (req, res) => {
  try {
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
exports.Signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await UserAdmin.findOne({ email });

    if (!user) {
      console.error(`User with email '${email}' not found`);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check if the provided password matches the stored password hash
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      console.error(`Password mismatch for user with email '${email}'`);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Create a JSON Web Token (JWT) with user information
    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    // Set the JWT expiration time (e.g., 1 hour)
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send the JWT as a response
    res.json({ token });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete UserAdmin by ID
exports.deleteUserAdminById = async (req, res) => {
  try {
    const userId = req.params.id;

    const deletedUserAdmin = await UserAdmin.findByIdAndRemove(userId);

    if (!deletedUserAdmin) {
      return res.status(404).json({ error: "UserAdmin not found" });
    }

    res.json({ message: "UserAdmin deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update UserAdmin by ID
exports.updateUserAdminById = async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;

    const updatedUserAdmin = await UserAdmin.findByIdAndUpdate(
      userId,
      updates,
      { new: true }
    );

    if (!updatedUserAdmin) {
      return res.status(404).json({ error: "UserAdmin not found" });
    }

    res.json(updatedUserAdmin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get UserAdmin by ID
exports.getUserAdminById = async (req, res) => {
  try {
    const userId = req.params.id;
    const userAdmin = await UserAdmin.findById(userId);

    if (!userAdmin) {
      return res.status(404).json({ error: "UserAdmin not found" });
    }

    res.json(userAdmin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all UserAdmins
exports.getAllUserAdmins = async (req, res) => {
  try {
    const userAdmins = await UserAdmin.find();
    res.json(userAdmins);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.Adminrole = (req, res, nxt) => {
  if (req.user && req.user.role === "Admin") {
    nxt();
  } else {
    res.status(201).json({ msg: "Unauthorised" });
  }
};
