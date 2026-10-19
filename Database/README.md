# VENORA Database

This folder contains the database design and supporting documentation for the VENORA project.

## Database Technology

VENORA uses **MongoDB** as its database management system.

MongoDB is used because it provides a flexible document-based structure that is suitable for storing vendor, supplier, procurement, quotation, recommendation, and market-related data.

## Database Documentation

The database documentation includes:

- Complete MongoDB database schema
- Collection-wise field definitions
- Data types and required/optional fields
- References and relationships between collections
- Overall database relationship structure
- Security and implementation guidelines

## Main Collections

The VENORA database contains the following 13 main collections:

1. **Users** – Stores user authentication and basic account information.
2. **VendorProfiles** – Stores vendor company and business profile information.
3. **SupplierProfiles** – Stores supplier company, availability, and performance information.
4. **Requirements** – Stores procurement requirements submitted by vendors.
5. **Products/Offerings** – Stores products and services offered by suppliers.
6. **Quotations** – Stores quotations submitted by suppliers for requirements.
7. **CompatibilityScores** – Stores supplier matching scores generated for requirements.
8. **Ratings/Feedback** – Stores ratings and feedback provided by vendors for suppliers.
9. **MarketInfo** – Stores current market information such as prices, demand, and supply.
10. **MarketPredictions** – Stores predicted market prices and trends.
11. **Deals/Contracts** – Stores finalized agreements between vendors and suppliers.
12. **Messages** – Stores communication between users.
13. **Notifications** – Stores system notifications for users.

## Database Schema

The complete collection-wise database schema is available in:

**[database-schema.md](./database-schema.md)**

The schema document contains:

- Field names
- Data types
- Required/optional status
- Collection references
- Collection relationships
- Security and implementation notes

## Vendor Database Flow

The database supports the following vendor workflow:

```text
Login/Register
      ↓
Vendor Dashboard
      ↓
Create Requirement
      ↓
Requirement Details
      ↓
Supplier Recommendations
      ↓
Compare Suppliers
      ↓
Receive and Compare Quotations
      ↓
Deal/Contract
