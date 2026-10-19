require("dotenv").config();

const Supplier = require("../models/Supplier");

const sampleSuppliers = [
{
name: "Aarav Mehta",
companyName: "Aarav Cotton Traders",
industry: "Textile",
materials: ["cotton", "cotton fabric"],
pricePerUnit: 180,
qualityScore: 9,
deliveryDays: 3,
rating: 4.7,
availableQuantity: 1200,
location: "Jaipur"
},
{
name: "Priya Sharma",
companyName: "Pink City Textiles",
industry: "Textile",
materials: ["cotton", "cotton fabric"],
pricePerUnit: 195,
qualityScore: 8,
deliveryDays: 5,
rating: 4.5,
availableQuantity: 900,
location: "Jaipur"
},
{
name: "Rahul Verma",
companyName: "Rajasthan Cotton House",
industry: "Textile",
materials: ["cotton", "cotton fabric"],
pricePerUnit: 170,
qualityScore: 7,
deliveryDays: 4,
rating: 4.1,
availableQuantity: 700,
location: "Ajmer"
},
{
name: "Neeraj Singh",
companyName: "Premium Fibre Supply",
industry: "Textile",
materials: ["cotton", "cotton fabric"],
pricePerUnit: 188,
qualityScore: 9.5,
deliveryDays: 6,
rating: 4.8,
availableQuantity: 1500,
location: "Delhi"
},
{
name: "Karan Jain",
companyName: "Jaipur Steel Works",
industry: "Steel",
materials: ["steel", "steel rods"],
pricePerUnit: 150,
qualityScore: 9,
deliveryDays: 2,
rating: 4.6,
availableQuantity: 2000,
location: "Jaipur"
},
{
name: "Meena Joshi",
companyName: "Aravali Timber Traders",
industry: "Wood",
materials: ["wood", "timber"],
pricePerUnit: 90,
qualityScore: 8,
deliveryDays: 4,
rating: 4.2,
availableQuantity: 600,
location: "Udaipur"
}
];

try {
const count = Supplier.seed(sampleSuppliers);
console.log(`Successfully added ${count} sample suppliers.`);
} catch (error) {
console.error("Could not seed suppliers:", error.message);
process.exitCode = 1;
}
