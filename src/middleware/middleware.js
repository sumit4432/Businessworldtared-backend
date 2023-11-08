const jwt = require("jsonwebtoken");
const ContactProfile = require("../model/contactprofileSchema");

exports.requiresignin = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    try {
      const { userId, iat, exp } = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token:", { userId, iat, exp }); // Add this line
      req.user = { userId, iat, exp };
      next();
    } catch (error) {
      console.log("Token Verification Error:", error);
      return res.status(401).json({ message: "Invalid token" });
    }
  } else {
    return res.status(401).json({ message: "Missing token" });
  }
};

// profifle fteching
exports.fetchContactProfile = async (req, res, next) => {
  const authUserId = req.user.userId;

  try {
    const contactProfile = await ContactProfile.findOne({ userId: authUserId });

    if (!contactProfile) {
      return res
        .status(404)
        .json({ error: "Contact profile not found for the user." });
    }

    // Attach the fetched contact profile to the request object for later use
    req.contactProfile = contactProfile;

    // Move to the next middleware or route handler
    next();
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// ***************** only admin can create category middleware***************

exports.checkRoles = (roles) => {
  return (req, res, next) => {
    console.log("req.user:", req.user); // debug statement
    if (req.user && req.user.role && roles.includes(req.user.role)) {
      console.log(req.user);
      next();
    } else {
      console.log("user role is not defne");
      return res.status(401).json({ error: "Unauthorized" });
    }
  };
};

exports.AdminMiddleWare = async (req, res, next) => {
  console.log("req.user:", req.user);
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied" });
  }
  next();
};

exports.authorizeEmailAndPhone = (requiredEmail, requiredPhone) => {
  return (req, res, next) => {
    const { email, phone } = res.locals.user; 
    if (email === requiredEmail && phone === requiredPhone) {
      next(); // Grant access
    } else {
      res.status(403).json({ error: "Access denied" });
    }
  };
};

exports.UserMiddleWare = async (req, res, next) => {
  console.log("req.user:", req.user);
  if (!req.user || req.user.role !== "User") {
    return res.status(403).json({ msg: "Access denied" });
  }

  next();
};

const generateKey = (req, res, next) => {
  const key = uuid.v4();
  t;
  req.body.key = key;

  next();
};
