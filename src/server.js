const express = require("express");
const mongoose = require("mongoose");
const env = require("dotenv");
const app = express();
const cors = require("cors");
const path = require("path");

// Load environment variables
env.config(); // Load environment variables from .env file

// Routes
const adminRoutes = require("./routes/adminRoutes");
const productRoutes = require("./routes/productroute");
const PostByRequirementRoute = require("./routes/postByReq");
const getAllPostRoute = require("./routes/postByReq");

// MongoDB connection
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.pjx444m.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Database connected");
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });
// Middleware
app.use(cors({ origin: true }));
app.use(express.json()); // <- This comes before route definitions
app.use(express.urlencoded({ extended: true })); // <- This comes before route definitions
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api", adminRoutes);
app.use("/api", PostByRequirementRoute);
app.use("/api", getAllPostRoute);
app.use("/api", productRoutes);
