const authenticateUserMiddleware = (req, res, next) => {
  // Check if the user is authenticated and attach user information to req.user
  if (req.isAuthenticated()) {
    req.user = req.user; // Replace this line with the appropriate code to attach user information
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
};
