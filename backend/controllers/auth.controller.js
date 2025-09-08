const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User.js");
const crypto = require('crypto');
const EmailService = require('../services/email.service');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "fallback-secret", {
    expiresIn: process.env.JWT_EXPIRE || "30d",
  });
};

// Register user
const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Login user
const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Google OAuth callback handler
const googleCallback = async (req, res, next) => {
  try {
    console.log("Google OAuth callback - User:", req.user);

    if (!req.user) {
      console.error("No user found in Google OAuth callback");
      return res.redirect(
        `${process.env.FRONTEND_URL}/login?error=oauth_failed`
      );
    }

    // Generate JWT token for the authenticated user
    const token = generateToken(req.user._id);

    console.log("Generated token for user:", req.user.email);

    // Redirect to frontend with token as query parameter
    // Frontend should extract this token and store it in localStorage/cookies
    const redirectUrl = `${
      process.env.FRONTEND_URL
    }/auth/callback?token=${token}&user=${encodeURIComponent(
      JSON.stringify({
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        subscription: req.user.subscription,
        provider: req.user.provider,
      })
    )}`;

    console.log("Redirecting to:", redirectUrl);
    res.redirect(redirectUrl);
  } catch (error) {
    console.error("Google OAuth callback error:", error);
    next(error);
  }
};

// Get current user profile
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        subscription: user.subscription,
        portfolioCount: user.portfolioCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update user profile
const updateProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { name, email } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (email) {
      const existingUser = await User.findOne({
        email,
        _id: { $ne: req.user.id },
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email is already taken",
        });
      }
      updateData.email = email;
    }

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Upgrade subscription
const upgrade = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { subscription: "pro" },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: "Successfully upgraded to Pro subscription",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Downgrade subscription
const downgrade = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { subscription: "free" },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: "Successfully downgraded to Free subscription",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Request password reset - send email with token
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No user found with this email' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes expiry
    await user.save({ validateBeforeSave: false });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

    const emailSvc = new EmailService();
    await emailSvc.sendPasswordResetEmail(email, resetUrl);

    return res.json({ success: true, message: 'Password reset email sent' });
  } catch (error) {
    next(error);
  }
};

// Reset password - verify token and set new password
const resetPassword = async (req, res, next) => {
  try {
    const { token, email, password } = req.body;

    if (!token || !email || !password) {
      return res.status(400).json({ success: false, message: 'Token, email, and new password are required' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({ email }).select('+password +resetPasswordToken +resetPasswordExpires');
    if (!user || !user.resetPasswordToken || !user.resetPasswordExpires) {
      return res.status(400).json({ success: false, message: 'Invalid reset request' });
    }

    if (user.resetPasswordToken !== hashedToken || user.resetPasswordExpires < new Date()) {
      return res.status(400).json({ success: false, message: 'Reset token is invalid or has expired' });
    }

    user.password = password; // will be hashed by pre-save hook
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.json({ success: true, message: 'Password has been reset successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  googleCallback,
  getMe,
  updateProfile,
  upgrade,
  downgrade,
  forgotPassword,
  resetPassword,
};
