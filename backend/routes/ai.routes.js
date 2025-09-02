const express = require("express");
const { protect } = require("../middleware/auth");
const aiController = require("../controllers/ai.controller.js");

const router = express.Router();

// Desc     -   Enhance text content using AI
// Route    -   POST /api/ai/enhance
// Access   -   Private (Pro only)
router.post("/enhance", protect, aiController.requirePro, aiController.enhance);

// Desc     -   Generate skills based on prompt
// Route    -   POST /api/ai/skills
// Access   -   Private (Pro only)
router.post("/skills", protect, aiController.requirePro, aiController.skills);

// Desc     -   Check AI service status
// Route    -   GET /api/ai/status
// Access   -   Private (Pro only)
router.get("/status", protect, aiController.requirePro, aiController.status);

module.exports = router;
