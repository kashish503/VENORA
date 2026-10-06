# Venora Database Schema

## 1. Overview

Venora uses MongoDB as its database system. The database is designed to support vendor management, supplier management, procurement requirements, supplier recommendations, quotations, compatibility scoring, market information, market predictions, deals, messaging, and notifications.

The database contains the following 13 main collections:

1. Users
2. VendorProfiles
3. SupplierProfiles
4. Requirements
5. Products/Offerings
6. Quotations
7. CompatibilityScores
8. Ratings/Feedback
9. MarketInfo
10. MarketPredictions
11. Deals/Contracts
12. Messages
13. Notifications

MongoDB ObjectId is used for document identification and for references between related collections.

---

# 2. Collections and Schemas

## 2.1 Users

The `Users` collection stores authentication and basic information of all users of the Venora system, including vendors, suppliers, and administrators.

| Field Name | Data Type | Required/Optional | Description / Reference |
|---|---|---|---|
| `_id` | ObjectId | Auto | Primary key |
| `name` | String | Required | Name of the user |
| `email` | String | Required | Unique email address used for login |
| `password` | String | Required | Hashed user password |
| `role` | String | Required | User role: `vendor`, `supplier`, or `admin` |
| `phone` | String | Optional | User contact number |
| `isActive` | Boolean | Required | Indicates whether the user account is active |
| `createdAt` | Date | Auto | Account creation date |
| `updatedAt` | Date | Auto | Last update date |

### Relationships

- One User can have one VendorProfile.
- One User can have one SupplierProfile.
- One User can send and receive many Messages.
- One User can receive many Notifications.

---

## 2.2 VendorProfiles

The `VendorProfiles` collection stores business and profile information of vendors using the Venora platform.

| Field Name | Data Type | Required/Optional | Description / Reference |
|---|---|---|---|
| `_id` | ObjectId | Auto | Primary key |
| `userId` | ObjectId | Required | Reference to `Users` |
| `companyName` | String | Required | Vendor company name |
| `industry` | String | Required | Industry in which the vendor operates |
| `businessType` | String | Optional | Type of business |
| `address` | String | Optional | Business address |
| `city` | String | Optional | City of the business |
| `state` | String | Optional | State of the business |
| `country` | String | Optional | Country of the business |
| `description` | String | Optional | Description of the vendor |
| `website` | String | Optional | Business website |
| `createdAt` | Date | Auto | Profile creation date |
| `updatedAt` | Date | Auto | Last profile update date |

### Relationships

- Each VendorProfile belongs to one User.
- One VendorProfile can create many Requirements.
- One VendorProfile can provide many Ratings/Feedback records.
- One VendorProfile can be associated with many Deals/Contracts.

---

## 2.3 SupplierProfiles

The `SupplierProfiles` collection stores supplier business information, availability, and performance-related information.

| Field Name | Data Type | Required/Optional | Description / Reference |
|---|---|---|---|
| `_id` | ObjectId | Auto | Primary key |
| `userId` | ObjectId | Required | Reference to `Users` |
| `companyName` | String | Required | Supplier company name |
| `industry` | String | Required | Industry served by the supplier |
| `description` | String | Optional | Description of the supplier |
| `address` | String | Optional | Supplier business address |
| `city` | String | Optional | City of the supplier |
| `state` | String | Optional | State of the supplier |
| `country` | String | Optional | Country of the supplier |
| `phone` | String | Optional | Supplier contact number |
| `website` | String | Optional | Supplier website |
| `availabilityStatus` | String | Required | Current availability status |
| `trustScore` | Number | Optional | Overall supplier trust score |
| `averageRating` | Number | Optional | Average supplier rating |
| `createdAt` | Date | Auto | Profile creation date |
| `updatedAt` | Date | Auto | Last profile update date |

### Relationships

- Each SupplierProfile belongs to one User.
- One SupplierProfile can have many Products/Offerings.
- One SupplierProfile can submit many Quotations.
- One SupplierProfile can have many CompatibilityScores.
- One SupplierProfile can receive many Ratings/Feedback records.
- One SupplierProfile can be associated with many Deals/Contracts.

---

## 2.4 Requirements

The `Requirements` collection stores procurement requirements submitted by vendors.

| Field Name | Data Type | Required/Optional | Description / Reference |
|---|---|---|---|
| `_id` | ObjectId | Auto | Primary key |
| `vendorId` | ObjectId | Required | Reference to `VendorProfiles` |
| `title` | String | Required | Title of the procurement requirement |
| `category` | String | Required | Product or material category |
| `industry` | String | Required | Relevant industry |
| `material` | String | Required | Required material or product |
| `description` | String | Optional | Detailed requirement description |
| `quantity` | Number | Required | Required quantity |
| `unit` | String | Required | Unit of measurement |
| `qualitySpecifications` | String | Optional | Required quality specifications |
| `budget` | Number | Optional | Maximum or expected budget |
| `deliveryLocation` | String | Optional | Required delivery location |
| `requiredBy` | Date | Optional | Required date |
| `status` | String | Required | Requirement status: `Draft`, `Open`, or `Closed` |
| `inputMethod` | String | Optional | Input method: `Manual` or `Voice` |
| `createdAt` | Date | Auto | Requirement creation date |
| `updatedAt` | Date | Auto | Last requirement update date |

### Relationships

- One VendorProfile can create many Requirements.
- One Requirement can receive many Quotations.
- One Requirement can have many CompatibilityScores.
- One Requirement can be associated with many Deals/Contracts.

---

## 2.5 Products/Offerings

The `Products/Offerings` collection stores products and services offered by suppliers.

| Field Name | Data Type | Required/Optional | Description / Reference |
|---|---|---|---|
| `_id` | ObjectId | Auto | Primary key |
| `supplierId` | ObjectId | Required | Reference to `SupplierProfiles` |
| `name` | String | Required | Product or offering name |
| `category` | String | Required | Product category |
| `industry` | String | Required | Relevant industry |
| `description` | String | Optional | Product or service description |
| `material` | String | Optional | Material used in the product |
| `specifications` | String | Optional | Product specifications |
| `qualityGrade` | String | Optional | Quality grade of the product |
| `price` | Number | Optional | Product price |
| `unit` | String | Optional | Price or quantity unit |
| `minimumOrderQuantity` | Number | Optional | Minimum order quantity |
| `availability` | Boolean | Required | Indicates whether the product is currently available |
| `createdAt` | Date | Auto | Product creation date |
| `updatedAt` | Date | Auto | Last product update date |

### Relationships

- One SupplierProfile can have many Products/Offerings.
- Each Product/Offering belongs to one SupplierProfile.

---

## 2.6 Quotations

The `Quotations` collection stores quotations submitted by suppliers against vendor requirements.

| Field Name | Data Type | Required/Optional | Description / Reference |
|---|---|---|---|
| `_id` | ObjectId | Auto | Primary key |
| `requirementId` | ObjectId | Required | Reference to `Requirements` |
| `supplierId` | ObjectId | Required | Reference to `SupplierProfiles` |
| `quotedPrice` | Number | Required | Price quoted by the supplier |
| `quantity` | Number | Required | Quantity included in the quotation |
| `deliveryTime` | Number | Optional | Estimated delivery time |
| `deliveryUnit` | String | Optional | Unit of delivery time |
| `qualityDetails` | String | Optional | Quality information provided by supplier |
| `termsAndConditions` | String | Optional | Quotation terms and conditions |
| `validUntil` | Date | Optional | Quotation validity date |
| `status` | String | Required | Status: `Pending`, `Accepted`, or `Rejected` |
| `submittedAt` | Date | Auto | Quotation submission date |
| `updatedAt` | Date | Auto | Last quotation update date |

### Relationships

- One Requirement can receive many Quotations.
- One SupplierProfile can submit many Quotations.
- A Quotation can be associated with one Deal/Contract.

---

## 2.7 CompatibilityScores

The `CompatibilityScores` collection stores the matching results between procurement requirements and suppliers.

The overall score can be used to rank suppliers and generate the Top 3 supplier recommendations.

| Field Name | Data Type | Required/Optional | Description / Reference |
|---|---|---|---|
| `_id` | ObjectId | Auto | Primary key |
| `requirementId` | ObjectId | Required | Reference to `Requirements` |
| `supplierId` | ObjectId | Required | Reference to `SupplierProfiles` |
| `overallScore` | Number | Required | Overall supplier compatibility score |
| `productMatchScore` | Number | Optional | Product/material matching score |
| `qualityScore` | Number | Optional | Quality matching score |
| `priceScore` | Number | Optional | Price matching score |
| `locationScore` | Number | Optional | Location matching score |
| `availabilityScore` | Number | Optional | Availability matching score |
| `performanceScore` | Number | Optional | Supplier performance score |
| `calculatedAt` | Date | Auto | Date and time when the score was calculated |

### Relationships

- One Requirement can have many CompatibilityScores.
- One SupplierProfile can have many CompatibilityScores.

### Note

This collection stores the matching results generated by the recommendation system. It does not represent the machine learning model itself.

---

## 2.8 Ratings/Feedback

The `Ratings/Feedback` collection stores ratings and feedback provided by vendors about suppliers.

| Field Name | Data Type | Required/Optional | Description / Reference |
|---|---|---|---|
| `_id` | ObjectId | Auto | Primary key |
| `vendorId` | ObjectId | Required | Reference to `VendorProfiles` |
| `supplierId` | ObjectId | Required | Reference to `SupplierProfiles` |
| `rating` | Number | Required | Rating from 1 to 5 |
| `feedback` | String | Optional | Written feedback |
| `dealId` | ObjectId | Optional | Reference to `Deals/Contracts` |
| `createdAt` | Date | Auto | Feedback creation date |
| `updatedAt` | Date | Auto | Last feedback update date |

### Relationships

- One VendorProfile can create many Ratings/Feedback records.
- One SupplierProfile can receive many Ratings/Feedback records.
- One Deal/Contract can be associated with many Ratings/Feedback records.

---

## 2.9 MarketInfo

The `MarketInfo` collection stores current market-related information such as prices, demand, and supply levels.

| Field Name | Data Type | Required/Optional | Description / Reference |
|---|---|---|---|
| `_id` | ObjectId | Auto | Primary key |
| `category` | String | Required | Market category |
| `material` | String | Required | Material or product |
| `industry` | String | Required | Relevant industry |
| `currentPrice` | Number | Optional | Current market price |
| `priceUnit` | String | Optional | Unit of the market price |
| `demandLevel` | String | Optional | Demand level: `Low`, `Medium`, or `High` |
| `supplyLevel` | String | Optional | Supply level: `Low`, `Medium`, or `High` |
| `location` | String | Optional | Market location |
| `source` | String | Optional | Source of market information |
| `recordedAt` | Date | Required | Date and time when market information was recorded |

### Relationships

- MarketInfo provides market data that can be used by the market prediction system.
- MarketInfo is logically related to MarketPredictions through material, category, and industry.

---

## 2.10 MarketPredictions

The `MarketPredictions` collection stores predicted future market prices and trends.

| Field Name | Data Type | Required/Optional | Description / Reference |
|---|---|---|---|
| `_id` | ObjectId | Auto | Primary key |
| `material` | String | Required | Material being predicted |
| `category` | String | Required | Product or market category |
| `industry` | String | Required | Relevant industry |
| `currentPrice` | Number | Optional | Current market price used for prediction |
| `predictedPrice` | Number | Required | Predicted future price |
| `predictionPeriod` | String | Required | Prediction time period |
| `trend` | String | Required | Trend: `Increasing`, `Decreasing`, or `Stable` |
| `confidenceScore` | Number | Optional | Confidence score of the prediction |
| `modelVersion` | String | Optional | Version of the prediction model |
| `predictedAt` | Date | Auto | Date and time of prediction |

### Relationships

- MarketPredictions is logically related to MarketInfo.
- The relationship is based on `material`, `category`, and `industry`.
- A direct ObjectId reference is not required for this design.

---

## 2.11 Deals/Contracts

The `Deals/Contracts` collection stores the final agreement between a vendor and a supplier after quotation evaluation.

| Field Name | Data Type | Required/Optional | Description / Reference |
|---|---|---|---|
| `_id` | ObjectId | Auto | Primary key |
| `vendorId` | ObjectId | Required | Reference to `VendorProfiles` |
| `supplierId` | ObjectId | Required | Reference to `SupplierProfiles` |
| `requirementId` | ObjectId | Required | Reference to `Requirements` |
| `quotationId` | ObjectId | Required | Reference to `Quotations` |
| `agreedPrice` | Number | Required | Final agreed price |
| `quantity` | Number | Required | Final agreed quantity |
| `termsAndConditions` | String | Optional | Final terms and conditions |
| `status` | String | Required | Status: `Active`, `Completed`, or `Cancelled` |
| `contractDate` | Date | Auto | Contract creation date |
| `updatedAt` | Date | Auto | Last contract update date |

### Relationships

- One VendorProfile can have many Deals/Contracts.
- One SupplierProfile can have many Deals/Contracts.
- One Requirement can be associated with many Deals/Contracts.
- One Quotation can be associated with one Deal/Contract.

### Scope Note

The current Venora system covers the deal/contract stage. Shipment tracking, delivery tracking, and order shipment management are outside the current project scope.

---

## 2.12 Messages

The `Messages` collection stores communication between users of the Venora system.

| Field Name | Data Type | Required/Optional | Description / Reference |
|---|---|---|---|
| `_id` | ObjectId | Auto | Primary key |
| `senderId` | ObjectId | Required | Reference to `Users` |
| `receiverId` | ObjectId | Required | Reference to `Users` |
| `requirementId` | ObjectId | Optional | Reference to `Requirements` |
| `dealId` | ObjectId | Optional | Reference to `Deals/Contracts` |
| `message` | String | Required | Message content |
| `isRead` | Boolean | Required | Indicates whether the message has been read |
| `sentAt` | Date | Auto | Message sending date and time |

### Relationships

- One User can send many Messages.
- One User can receive many Messages.
- A Message can optionally be related to a Requirement.
- A Message can optionally be related to a Deal/Contract.

---

## 2.13 Notifications

The `Notifications` collection stores system notifications for users.

| Field Name | Data Type | Required/Optional | Description / Reference |
|---|---|---|---|
| `_id` | ObjectId | Auto | Primary key |
| `userId` | ObjectId | Required | Reference to `Users` |
| `type` | String | Required | Type of notification |
| `title` | String | Required | Notification title |
| `message` | String | Required | Notification message |
| `relatedRequirementId` | ObjectId | Optional | Reference to `Requirements` |
| `relatedQuotationId` | ObjectId | Optional | Reference to `Quotations` |
| `relatedDealId` | ObjectId | Optional | Reference to `Deals/Contracts` |
| `isRead` | Boolean | Required | Indicates whether the notification has been read |
| `createdAt` | Date | Auto | Notification creation date |

### Relationships

- One User can receive many Notifications.
- A Notification can optionally be related to a Requirement.
- A Notification can optionally be related to a Quotation.
- A Notification can optionally be related to a Deal/Contract.

---

# 3. Overall Database Relationships

The major relationships between the collections are summarized below:

```text
Users
├── VendorProfiles
│   └── Requirements
│       ├── Quotations
│       ├── CompatibilityScores
│       └── Deals/Contracts
│
├── SupplierProfiles
│   ├── Products/Offerings
│   ├── Quotations
│   ├── CompatibilityScores
│   ├── Ratings/Feedback
│   └── Deals/Contracts
│
├── Messages
└── Notifications

VendorProfiles
├── Requirements
├── Ratings/Feedback
└── Deals/Contracts

SupplierProfiles
├── Products/Offerings
├── Quotations
├── CompatibilityScores
├── Ratings/Feedback
└── Deals/Contracts

Requirements
├── Quotations
├── CompatibilityScores
└── Deals/Contracts

Quotations
└── Deals/Contracts

Deals/Contracts
└── Ratings/Feedback

MarketInfo
└── MarketPredictions
