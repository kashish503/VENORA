
const mongoose = require("mongoose");

const requirementSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    industry: {
      type: String,
      required: true,
      trim: true
    },

    material: {
      type: String,
      required: true,
      trim: true
    },

    quantity: {
      type: Number,
      required: true,
      min: 0.01
    },

    budget: {
      type: Number,
      required: true,
      min: 0
    },

    location: {
      city: {
        type: String,
        required: true,
        trim: true
      },

      state: {
        type: String,
        required: true,
        trim: true
      }
    },

    status: {
      type: String,
      enum: ["open", "matched", "closed"],
      default: "open"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Requirement",
  requirementSchema,
  "Requirements"
);
