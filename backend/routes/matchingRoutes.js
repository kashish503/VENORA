const express = require("express");
const Supplier = require("../models/Supplier");
const { protect, allowRoles } = require("../middleware/auth");

const router = express.Router();

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

// Transparent rule-based scoring: material/industry are eligibility filters;
// eligible suppliers are scored on price, quality, delivery, and rating.
function scoreSupplier(supplier, requirement, lowestEligiblePrice) {
  const budget = Number(requirement.maxBudget);
  const desiredQuality = Number(requirement.minQuality || 0);
  const maxDelivery = Number(requirement.maxDeliveryDays || 30);

  const priceScore = budget > 0
    ? clamp(((budget - supplier.pricePerUnit) / budget) * 100)
    : (supplier.pricePerUnit <= lowestEligiblePrice ? 100 : 0);

  const qualityScore = clamp((supplier.qualityScore / 10) * 100);
  const deliveryScore = clamp(((maxDelivery - supplier.deliveryDays) / maxDelivery) * 100);
  const ratingScore = clamp((supplier.rating / 5) * 100);

  // Weighted score: price 35%, quality 35%, delivery 20%, rating 10%.
  const compatibilityScore = Math.round(
    priceScore * 0.35 +
    qualityScore * 0.35 +
    deliveryScore * 0.20 +
    ratingScore * 0.10
  );

  return {
    supplierId: supplier._id,
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
    compatibilityScore,
    scoreBreakdown: {
      price: Math.round(priceScore),
      quality: Math.round(qualityScore),
      delivery: Math.round(deliveryScore),
      rating: Math.round(ratingScore)
    },
    meetsPreferredQuality: supplier.qualityScore >= desiredQuality
  };
}

router.post("/", protect, allowRoles("vendor"), async (req, res, next) => {
  try {
    const {
      industry, material, quantity, maxBudget, minQuality = 0,
      maxDeliveryDays = 30, location
    } = req.body;

    if (!industry || !material || quantity == null || maxBudget == null || !location) {
      return res.status(400).json({
        message: "industry, material, quantity, maxBudget and location are required."
      });
    }

    const parsedQuantity = Number(quantity);
    const budget = Number(maxBudget);
    const quality = Number(minQuality);
    const delivery = Number(maxDeliveryDays);

    if (![parsedQuantity, budget, quality, delivery].every(Number.isFinite) ||
        parsedQuantity <= 0 || budget <= 0 || quality < 0 || quality > 10 || delivery <= 0) {
      return res.status(400).json({ message: "Please provide valid positive values; minQuality must be between 0 and 10." });
    }

    const normalizedMaterial = String(material).trim().toLowerCase();
    const candidates = await Supplier.find({
      isActive: true,
      industry,
      materials: normalizedMaterial,
      availableQuantity: { $gte: parsedQuantity }
    });

    // If no supplier meets the budget, return no recommendations rather than
    // pretending an over-budget supplier is a valid match.
    const eligible = candidates.filter(s => s.pricePerUnit <= budget);
    if (!eligible.length) {
      return res.json({
        message: "No suppliers currently match the selected industry, material, quantity and budget.",
        requirement: { industry, material: normalizedMaterial, quantity: parsedQuantity, maxBudget: budget, minQuality: quality, maxDeliveryDays: delivery, location },
        count: 0,
        recommendations: []
      });
    }

    const lowestPrice = Math.min(...eligible.map(s => s.pricePerUnit));
    const recommendations = eligible
      .map(s => scoreSupplier(s, { maxBudget: budget, minQuality: quality, maxDeliveryDays: delivery }, lowestPrice))
      .sort((a, b) =>
        Number(b.meetsPreferredQuality) - Number(a.meetsPreferredQuality) ||
        b.compatibilityScore - a.compatibilityScore
      )
      .slice(0, 3);

    res.json({
      message: "Rule-based supplier matching completed.",
      scoringWeights: { price: "35%", quality: "35%", delivery: "20%", rating: "10%" },
      requirement: { industry, material: normalizedMaterial, quantity: parsedQuantity, maxBudget: budget, minQuality: quality, maxDeliveryDays: delivery, location },
      count: recommendations.length,
      recommendations
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
