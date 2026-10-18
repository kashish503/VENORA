
const mongoose = require("mongoose");

const supplierProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    companyName: {
      type: String,
      required: true,
      trim: true
    },

    industry: {
      type: String,
      required: true,
      trim: true
    },

    product: {
      type: String,
      required: true,
      trim: true
    },

    pricePerUnit: {
      type: Number,
      required: true,
      min: 0
    },

    qualityRating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },

    deliveryTimeDays: {
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

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "SupplierProfile",
  supplierProfileSchema,
  "SupplierProfiles"
);
