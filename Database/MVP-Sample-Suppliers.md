
# VENORA MVP Sample Supplier Data

## 1. Purpose

This document contains fictional supplier records for the first VENORA project demonstration. The data can be used to test supplier matching based on industry, product, price, quality rating, delivery time, and location.

All prices are illustrative and expressed in Indian Rupees (INR).

## 2. Sample Supplier List

| Supplier ID | Company Name | Industry | Product | Price Per Unit (INR) | Quality Rating (1–5) | Delivery Time (Days) | City | State | Active |
|---|---|---|---|---:|---:|---:|---|---|---|
| SUP001 | Shree Timber Suppliers | Wood | Plywood sheet (per sheet) | 850 | 4.5 | 3 | Gurugram | Haryana | Yes |
| SUP002 | GreenWood Materials | Wood | Teak wood plank (per cubic foot) | 1650 | 4.8 | 5 | Delhi | Delhi | Yes |
| SUP003 | Haryana Timber House | Wood | MDF board (per board) | 620 | 4.1 | 2 | Panipat | Haryana | Yes |
| SUP004 | Aarav Steel Traders | Steel | Mild steel rod (per kg) | 72 | 4.4 | 2 | Faridabad | Haryana | Yes |
| SUP005 | Prime Metal Works | Steel | Stainless steel sheet (per sheet) | 2400 | 4.8 | 5 | Delhi | Delhi | Yes |
| SUP006 | Northline Steel Supplies | Steel | Steel angle (per kg) | 68 | 4.0 | 3 | Rohtak | Haryana | Yes |
| SUP007 | Shakti Textiles | Textile | Cotton fabric (per meter) | 95 | 4.6 | 3 | Panipat | Haryana | Yes |
| SUP008 | WeaveWell Fabrics | Textile | Denim fabric (per meter) | 180 | 4.3 | 4 | Delhi | Delhi | Yes |
| SUP009 | ColorCotton Suppliers | Textile | Polyester fabric (per meter) | 75 | 4.0 | 2 | Jaipur | Rajasthan | Yes |

## 3. Data Fields

- **Supplier ID:** A temporary identifier used in this sample list.
- **Company Name:** Supplier's business name.
- **Industry:** Industry category served by the supplier.
- **Product:** Product or material supplied, including its pricing unit.
- **Price Per Unit:** Illustrative cost for one product unit in INR.
- **Quality Rating:** Supplier quality score from 1 to 5.
- **Delivery Time:** Estimated number of days required to supply the product.
- **City and State:** Supplier location.
- **Active:** Indicates whether the supplier is eligible for matching.

## 4. Sample Matching Scenario

A vendor submits the following requirement:

| Field | Example Value |
|---|---|
| Industry | Steel |
| Material | Mild steel rod |
| Quantity | 100 kg |
| Total Budget | ₹8,000 |
| Delivery Location | Faridabad, Haryana |

For Aarav Steel Traders:

- Price per kg = ₹72
- Quantity = 100 kg
- Estimated total cost = ₹7,200
- Budget = ₹8,000
- Quality rating = 4.4/5
- Estimated delivery time = 2 days

The estimated total cost is within the budget. The backend should evaluate other relevant suppliers and return the top three eligible matches when at least three suitable suppliers are available.

## 5. Integration Notes

1. These records are sample documentation, not yet inserted into MongoDB.
2. The backend developer should map each supplier profile to a valid supplier account using the `userId` reference.
3. MongoDB should generate actual document IDs and store `createdAt` and `updatedAt` dates.
4. Supplier prices must be compared using consistent units. For example, a price per kg should only be compared with a requirement quantity expressed in kg.
5. The matching algorithm should consider product compatibility, budget, quality, delivery time, and location. Final ranking depends on the backend's matching logic.

## 6. Note

All names, prices, ratings, and delivery times are fictional and intended only for development and demonstration.
