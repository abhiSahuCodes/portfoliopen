const express = require("express");
const { body } = require("express-validator");
const { protect } = require("../middleware/auth.js");
const authController = require("../controllers/auth.controller.js");

const router = express.Router();

// Desc      -   Register user
// Route     -   POST /api/auth/register
// Access    -   Public
router.post(
  "/register",
  [
    body("name")
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Name must be between 2 and 50 characters"),
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please enter a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  authController.register
);

// Desc     -   Login user
// Route    -   POST /api/auth/login
// Access   -   Public
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please enter a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  authController.login
);

// Desc      -   Get current user profile
// Route     -   GET /api/auth/me
// Access    -   Private
router.get("/me", protect, authController.getMe);

// Desc-     -   Update user profile
// Route     -   PUT /api/auth/profile
// Access    -   Private
router.put(
  "/profile",
  protect,
  [
    body("name")
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Name must be between 2 and 50 characters"),
    body("email")
      .optional()
      .isEmail()
      .normalizeEmail()
      .withMessage("Please enter a valid email"),
  ],
  authController.updateProfile
);

// Desc      -   Upgrade user to pro subscription
// Route     -   PUT /api/auth/upgrade
// Access    -   Private
router.put("/upgrade", protect, authController.upgrade);

// Desc      -   Downgrade subscription
// Route     -   PUT /api/auth/downgrade
// Access    -   Private
router.put("/downgrade", protect, authController.downgrade);

module.exports = router;
