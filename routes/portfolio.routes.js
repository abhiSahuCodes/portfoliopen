const express = require("express");
const { body } = require("express-validator");
const { protect, optionalAuth } = require("../middleware/auth.js");
const portfolioController = require("../controllers/portfolioController.js");

const router = express.Router();

// Desc      -   Get all portfolios for authenticated user
// Route     -   GET /api/portfolios
// Access    -   Private
router.get("/", protect, portfolioController.getAll);

// Desc      -   Get single portfolio by ID
// Route     -   GET /api/portfolios/:id
// Access    -   Private
router.get("/:id", protect, portfolioController.getById);

// Desc      -   Create new portfolio
// Route     -   POST /api/portfolios
// Access    -   Private
router.post(
  "/",
  protect,
  [
    body("title")
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage("Title must be between 1 and 100 characters"),
    body("sections")
      .optional()
      .isArray()
      .withMessage("Sections must be an array"),
    body("theme").optional().isObject().withMessage("Theme must be an object"),
  ],
  portfolioController.create
);

// Desc      -   Update portfolio
// Route     -   PUT /api/portfolios/:id
// Access    -   Private
router.put(
  "/:id",
  protect,
  [
    body("title")
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage("Title must be between 1 and 100 characters"),
    body("sections")
      .optional()
      .isArray()
      .withMessage("Sections must be an array"),
    body("theme").optional().isObject().withMessage("Theme must be an object"),
  ],
  portfolioController.update
);

// Desc      -   Delete portfolio
// Route     -   DELETE /api/portfolios/:id
// Access    -   Private
router.delete("/:id", protect, portfolioController.remove);

// Desc      -   Get public portfolio by slug
// Route     -   GET /api/portfolios/public/:slug
// Access    -   Public
router.get("/public/:slug", optionalAuth, portfolioController.getPublicBySlug);

// Desc      -   Duplicate portfolio
// Route     -   POST /api/portfolios/:id/duplicate
// Access    -   Private
router.post("/:id/duplicate", protect, portfolioController.duplicate);

module.exports = router;
