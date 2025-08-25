const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided",
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "fallback-secret"
      );

      // Get user from token
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Token is valid but user not found",
        });
      }

      // Add user to request object
      req.user = {
        id: user._id,
        name: user.name,
        email: user.email,
        subscription: user.subscription,
      };

      next();
    } catch (tokenError) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error in authentication",
    });
  }
};

// Optional auth - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || "fallback-secret"
        );
        const user = await User.findById(decoded.userId);

        if (user) {
          req.user = {
            id: user._id,
            name: user.name,
            email: user.email,
            subscription: user.subscription,
          };
        }
      } catch (tokenError) {
        // Token is invalid, but we continue without user
        req.user = null;
      }
    }

    next();
  } catch (error) {
    next();
  }
};

module.exports = { protect, optionalAuth };
