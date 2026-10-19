const express = require("express");
const Supplier = require("../models/Supplier");
const { protect, allowRoles } = require("../middleware/auth");

const router = express.Router();

function scoreSupplier(supplier, criteria) {
  const priceScore = Math.max(
    0,
    Math.min(100, (1 - supplier.pricePerUnit / criteria.maxBudget) * 100)
  );

  const qualityScore = Math.max(
    0,
    Math.min(100, (supplier.qualityScore / 10) * 100)
  );

  const deliveryScore = Math.max(
    0,
    Math.min(100, (1 - (supplier.deliveryDays - 1) / 29) * 100)
  );

  const ratingScore = Math.max(
    0,
    Math.min(100, (supplier.rating / 5) * 100)
  );

  const quantityScore = Math.max(
    0,
    Math.min(100, (supplier.availableQuantity / criteria.quantity) * 100)
  );

  const locationScore = criteria.location
    ? supplier.location.trim().toLowerCase() ===
      criteria.location.trim().toLowerCase()
      ? 100
      : 50
    : 75;

  const totalScore =
    priceScore * 0.25 +
    qualityScore * 0.25 +
    deliveryScore * 0.15 +
    ratingScore * 0.15 +
    quantityScore * 0.1 +
    locationScore * 0.1;

  return {
    supplierId: supplier.id,
    name: supplier.name,
    companyName: supplier.companyName,
    industry: supplier.industry,
    materials: supplier.materials,
    pricePerUnit: supplier.pricePerUnit,
    qualityScore: supplier.qualityScore,
    deliveryDays: supplier.deliveryDays,
    rating: supplier.rating,
    availableQuantity: supplier.availableQuantity,
    location: supplier.location,
    compatibilityScore: Number(totalScore.toFixed(2)),
    scoreBreakdown: {
      price: Number(priceScore.toFixed(2)),
      quality: Number(qualityScore.toFixed(2)),
      deliveryTime: Number(deliveryScore.toFixed(2)),
      supplierRating: Number(ratingScore.toFixed(2)),
      quantityAvailability: Number(quantityScore.toFixed(2)),
      location: Number(locationScore.toFixed(2))
    }
  };
}

router.post("/", protect, allowRoles("vendor"), (req, res, next) => {
  try {
    const {
      industry,
      material,
      quantity,
      maxBudget,
      location = ""
    } = req.body;

    if (!industry || !material || quantity == null || maxBudget == null) {
      return res.status(400).json({
        message: "industry, material, quantity and maxBudget are required."
      });
    }

    const parsedQuantity = Number(quantity);
    const parsedBudget = Number(maxBudget);

    if (
      !Number.isFinite(parsedQuantity) ||
      parsedQuantity <= 0 ||
      !Number.isFinite(parsedBudget) ||
      parsedBudget <= 0
    ) {
      return res.status(400).json({
        message: "Quantity and maximum budget must be positive numbers."
      });
    }

    const validIndustries = ["Textile", "Steel", "Wood", "Other"];

    const selectedIndustry = validIndustries.find(
      item => item.toLowerCase() === String(industry).trim().toLowerCase()
    );

    if (!selectedIndustry) {
      return res.status(400).json({
        message: "Industry must be Textile, Steel, Wood or Other."
      });
    }

    const normalizedMaterial = String(material).trim().toLowerCase();

    const criteria = {
      industry: selectedIndustry,
      material: normalizedMaterial,
      quantity: parsedQuantity,
      maxBudget: parsedBudget,
      location: String(location).trim()
    };

    const eligibleSuppliers = Supplier.findMatching({
      industry: selectedIndustry,
      material: normalizedMaterial,
      quantity: parsedQuantity
    }).filter(supplier => supplier.pricePerUnit <= parsedBudget);

    const recommendations = eligibleSuppliers
      .map(supplier => scoreSupplier(supplier, criteria))
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
      .slice(0, 3)
      .map((supplier, index) => ({
        rank: index + 1,
        ...supplier
      }));

    return res.json({
      message: recommendations.length
        ? "Top supplier recommendations generated successfully."
        : "No suppliers match your requirements. Try adjusting your budget, quantity or material.",
      criteria,
      scoringWeights: {
        price: "25%",
        quality: "25%",
        deliveryTime: "15%",
        supplierRating: "15%",
        quantityAvailability: "10%",
        location: "10%"
      },
      matchingParameters: [
        "Quantity",
        "Quality",
        "Delivery Time",
        "Price",
        "Supplier Rating",
        "Location"
      ],
      count: recommendations.length,
      recommendations
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
