const express = require("express");
const Supplier = require("../models/Supplier");
const { protect, allowRoles } = require("../middleware/auth");

const router = express.Router();

// Get active suppliers with optional filters.
router.get("/", (req, res, next) => {
try {
const filters = {};

```
if (req.query.industry) {
  filters.industry = String(req.query.industry).trim();
}

if (req.query.material) {
  filters.material = String(req.query.material).trim();
}

if (req.query.location) {
  filters.location = String(req.query.location).trim();
}

const suppliers = Supplier.findAll(filters);

res.json({
  count: suppliers.length,
  suppliers
});
```

} catch (error) {
next(error);
}
});

// Create a supplier profile. Only logged-in suppliers can access this.
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

```
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

const validIndustries = ["Textile", "Steel", "Wood", "Other"];
const selectedIndustry = validIndustries.find(
  item => item.toLowerCase() === String(industry).toLowerCase()
);

if (!selectedIndustry) {
  return res.status(400).json({
    message: "Industry must be Textile, Steel, Wood or Other."
  });
}

const price = Number(pricePerUnit);
const quality = Number(qualityScore);
const delivery = Number(deliveryDays);
const quantity = Number(availableQuantity);
const supplierRating = Number(rating);

if (
  !Number.isFinite(price) || price < 0 ||
  !Number.isFinite(quality) || quality < 0 || quality > 10 ||
  !Number.isInteger(delivery) || delivery < 1 ||
  !Number.isFinite(quantity) || quantity < 0 ||
  !Number.isFinite(supplierRating) ||
  supplierRating < 0 || supplierRating > 5
) {
  return res.status(400).json({
    message: "Please enter valid price, quality, delivery, quantity and rating values."
  });
}

const supplier = Supplier.create({
  userId: req.user.id,
  name: String(name).trim(),
  companyName: String(companyName).trim(),
  industry: selectedIndustry,
  materials: materials.map(m => String(m).trim().toLowerCase()).filter(Boolean),
  pricePerUnit: price,
  qualityScore: quality,
  deliveryDays: delivery,
  rating: supplierRating,
  availableQuantity: quantity,
  location: String(location).trim()
});

res.status(201).json({
  message: "Supplier profile created.",
  supplier
});
```

} catch (error) {
next(error);
}
});

module.exports = router;
