const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "header",
        "about",
        "projects",
        "contact",
        "skills",
        "experience",
        "education",
      ],
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { _id: false }
);

const themeSchema = new mongoose.Schema(
  {
    primaryColor: {
      type: String,
      default: "#6E59A5",
    },
    secondaryColor: {
      type: String,
      default: "#2DD4BF",
    },
    fontFamily: {
      type: String,
      default: "Inter, sans-serif",
    },
  },
  { _id: false }
);

const portfolioSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Portfolio title is required"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sections: [sectionSchema],
    theme: {
      type: themeSchema,
      default: () => ({}),
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create slug from title
portfolioSchema.pre("save", function (next) {
  if (this.isModified("title") && this.isPublic) {
    this.slug =
      this.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") +
      "-" +
      this._id.toString().slice(-6);
  }
  next();
});

// Index for better query performance
portfolioSchema.index({ user: 1, createdAt: -1 });
portfolioSchema.index({ slug: 1 });

module.exports = mongoose.model("Portfolio", portfolioSchema);
