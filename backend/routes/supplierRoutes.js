
const express = require("express");
const Supplier = require("../models/Supplier");
const { protect, allowRoles } = require("../middleware/auth");

const router = express.Router();

// GET /api/suppliers
// List active suppliers with optional filters.
router.get("/", (req, res, next) => {
  try {
    const filters = {};

    if (req.query.industry) {
      filters.industry = String(req.query.industry);
    }

    if (req.query.material) {
      filters.material = String(req.query.material);
    }

    if (req.query.location) {
      filters.location = String(req.query.location);
    }

    const suppliers = Supplier.findAll(filters);

    return res.json({
      count: suppliers.length,
      suppliers
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/suppliers
// Create a supplier catalogue entry.
router.post("/", protect, allowRoles("supplier"), (req, res, next) => {
  try {
    const {
      name,
      companyName,
      industry,
      materials,
      pricePerUnit,
      qualityScore,
      deliveryDays,
      rating = 0,
      availableQuantity,
      location
    } = req.body;

    if (
      !name ||
      !companyName ||
      !industry ||
      !Array.isArray(materials) ||
      materials.length === 0 ||
      pricePerUnit == null ||
      qualityScore == null ||
      deliveryDays == null ||
      availableQuantity == null ||
      !location
    ) {
      return res.status(400).json({
        message: "Please provide all required supplier profile fields."
      });
    }

    if (
      !Number.isFinite(Number(pricePerUnit)) ||
      Number(pricePerUnit) < 0 ||
      !Number.isFinite(Number(qualityScore)) ||
      Number(qualityScore) < 0 ||
      Number(qualityScore) > 5 ||
      !Number.isFinite(Number(deliveryDays)) ||
      Number(deliveryDays) < 0 ||
      !Number.isFinite(Number(availableQuantity)) ||
      Number(availableQuantity) < 0
    ) {
      return res.status(400).json({
        message: "Please provide valid price, quality, delivery and quantity values."
      });
    }

    const supplier = Supplier.create({
      userId: req.user?._id ?? req.user?.id ?? null,
      name: String(name).trim(),
      companyName: String(companyName).trim(),
      industry: String(industry).trim(),
      materials: materials.map(m =>
        String(m).trim().toLowerCase()
      ),
      pricePerUnit: Number(pricePerUnit),
      qualityScore: Number(qualityScore),
      deliveryDays: Number(deliveryDays),
      rating: Number(rating),
      availableQuantity: Number(availableQuantity),
      location: String(location).trim()
    });

    return res.status(201).json({
      message: "Supplier profile created.",
      supplier
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
