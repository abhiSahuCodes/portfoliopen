const { validationResult } = require("express-validator");
const Portfolio = require("../models/Portfolio.js");
const User = require("../models/User.js");

const getAll = async (req, res, next) => {
  try {
    const portfolios = await Portfolio.find({ user: req.user.id })
      .sort({ updatedAt: -1 })
      .select("-__v");

    res.json({
      success: true,
      count: portfolios.length,
      portfolios,
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).select("-__v");

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }

    res.json({ success: true, portfolio });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { title, sections, theme, isPublic } = req.body;

    const portfolio = await Portfolio.create({
      title,
      user: req.user.id,
      sections: sections || [],
      theme: theme || {},
      isPublic: isPublic || false,
    });

    await User.findByIdAndUpdate(req.user.id, { $inc: { portfolioCount: 1 } });

    res.status(201).json({
      success: true,
      message: "Portfolio created successfully",
      portfolio,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { title, sections, theme, isPublic } = req.body;

    let portfolio = await Portfolio.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!portfolio) {
      return res
        .status(404)
        .json({ success: false, message: "Portfolio not found" });
    }

    if (title !== undefined) portfolio.title = title;
    if (sections !== undefined) portfolio.sections = sections;
    if (theme !== undefined) portfolio.theme = { ...portfolio.theme, ...theme };
    if (isPublic !== undefined) portfolio.isPublic = isPublic;

    await portfolio.save();

    res.json({
      success: true,
      message: "Portfolio updated successfully",
      portfolio,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!portfolio) {
      return res
        .status(404)
        .json({ success: false, message: "Portfolio not found" });
    }

    await Portfolio.findByIdAndDelete(req.params.id);
    await User.findByIdAndUpdate(req.user.id, { $inc: { portfolioCount: -1 } });

    res.json({ success: true, message: "Portfolio deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const getPublicBySlug = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({
      slug: req.params.slug,
      isPublic: true,
    })
      .populate("user", "name")
      .select("-__v");

    if (!portfolio) {
      return res
        .status(404)
        .json({ success: false, message: "Public portfolio not found" });
    }

    res.json({ success: true, portfolio });
  } catch (error) {
    next(error);
  }
};

const duplicate = async (req, res, next) => {
  try {
    const originalPortfolio = await Portfolio.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!originalPortfolio) {
      return res
        .status(404)
        .json({ success: false, message: "Portfolio not found" });
    }

    const duplicatePortfolio = await Portfolio.create({
      title: `${originalPortfolio.title} (Copy)`,
      user: req.user.id,
      sections: originalPortfolio.sections,
      theme: originalPortfolio.theme,
      isPublic: false,
    });

    await User.findByIdAndUpdate(req.user.id, { $inc: { portfolioCount: 1 } });

    res.status(201).json({
      success: true,
      message: "Portfolio duplicated successfully",
      portfolio: duplicatePortfolio,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  getPublicBySlug,
  duplicate,
};
