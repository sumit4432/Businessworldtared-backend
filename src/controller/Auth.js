const userSchema = require("../model/AuthSchema");
const User = require("../model/AuthSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, role, state, city } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists with email:", email);
      return res
        .status(409)
        .json({ message: "User with this email already exists" });
    }

    // Hash the password before saving

    const hashedPassword = await bcrypt.hash(password, 10); // Using salt factor 10

    console.log("Hashed Password:", hashedPassword);

    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
      state,
      city,
    });

    await newUser.save();

    return res
      .status(201)
      .json({ message: "User registered successfully", newUser });
  } catch (error) {
    console.error("Error during registration:", error);
    return res
      .status(500)
      .json({ message: "An error occurred during registration" });
  }
};

// Sign-in endpoint
exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Sign-in attempt with email:", email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("No user found with email:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log("Invalid password for user:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({ message: "Sign-in successful", user, token });
  } catch (error) {
    console.error("Error during sign-in:", error);
    return res
      .status(500)
      .json({ message: "An error occurred during sign-in" });
  }
};

exports.logout = (req, res) => {
  try {
    // Clear the token from the client-side (e.g., delete cookie or remove token from local storage)
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.updateRole = async (req, res) => {
  const { userId, role } = req.body;
  // userid// //role
  if (!userId || !role) {
    return res.status(400).json({ error: "Invalid request parameters" });
  }
  // Update the user's role in the database
  const updatedUser = await userSchema.findOneAndUpdate(
    { _id: userId },
    { role: role },
    { new: true }
  );
  if (!updatedUser) {
    return res.status(400).json({ error: "Failed to update user role" });
  }
  // Generate a new token with the updated role
  const newToken = jwt.sign(
    { user: { id: updatedUser._id, role: updatedUser.role } },
    key,
    { expiresIn: "5h" }
  );

  return res
    .status(200)
    .json({ success: true, user: updatedUser, token: newToken });
};

exports.Getalluser = async (req, res) => {
  try {
    const allUsers = await User.find();
    res.status(200).json({ users: allUsers });
    console.log("All users:", allUsers);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching users" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await user.deleteOne();

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error during user deletion:", error);
    return res
      .status(500)
      .json({ error: "An error occurred during user deletion" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log("hello user", userId);
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error while fetching user:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching user" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const updateFields = req.body;

    // Find the user by userId
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the specified fields from the request body
    Object.assign(user, updateFields);

    await user.save();

    return res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error during user update:", error);
    return res
      .status(500)
      .json({ error: "An error occurred during user update" });
  }
};

exports.checkRoles = (roles) => (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, key);
    const user = decodedToken.user.role;

    console.log(user);
    if (roles.includes(user)) {
      next(); // Call next() if the user is authorized
    } else {
      next(new Error("Unauthorized")); // Call next() with an error if the user is not authorized
    }
  } catch (error) {
    next();
  }
};
