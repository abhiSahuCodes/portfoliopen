// Load environment variables
const dotenv = require("dotenv");
dotenv.config();

// Import dependencies
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const connectDB = require("./config/database.js");
const passport = require("./config/passport.js");
const { errorHandler } = require("./middleware/errorHandler.js");
const authRoutes = require("./routes/auth.routes.js");
const portfolioRoutes = require("./routes/portfolio.routes.js");
const aiRoutes = require("./routes/ai.routes.js");

// Create Express app
const app = express();
app.disable("x-powered-by");
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    // credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallback-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/portfolios", portfolioRoutes);
app.use("/api/ai", aiRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Portfolio Pen API is running",
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Start server
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(
      `📱 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:5173"}`
    );
  });
}

module.exports = app;
