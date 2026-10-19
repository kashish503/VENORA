# VENORA Entity Relationship Diagram

This ER diagram represents the major relationships between the 13 MongoDB collections used in the VENORA project.

```mermaid
erDiagram

    USERS {
        ObjectId _id PK
        String name
        String email
        String password
        String role
        String phone
        Boolean isActive
        Date createdAt
        Date updatedAt
    }

    VENDOR_PROFILES {
        ObjectId _id PK
        ObjectId userId FK
        String companyName
        String industry
        String businessType
        String address
        String city
        String state
        String country
        String description
        String website
        Date createdAt
        Date updatedAt
    }

    SUPPLIER_PROFILES {
        ObjectId _id PK
        ObjectId userId FK
        String companyName
        String industry
        String description
        String address
        String city
        String state
        String country
        String phone
        String website
        String availabilityStatus
        Number trustScore
        Number averageRating
        Date createdAt
        Date updatedAt
    }

    REQUIREMENTS {
        ObjectId _id PK
        ObjectId vendorId FK
        String title
        String category
        String industry
        String material
        String description
        Number quantity
        String unit
        String qualitySpecifications
        Number budget
        String deliveryLocation
        Date requiredBy
        String status
        String inputMethod
        Date createdAt
        Date updatedAt
    }

    PRODUCTS_OFFERINGS {
        ObjectId _id PK
        ObjectId supplierId FK
        String name
        String category
        String industry
        String description
        String material
        String specifications
        String qualityGrade
        Number price
        String unit
        Number minimumOrderQuantity
        Boolean availability
        Date createdAt
        Date updatedAt
    }

    QUOTATIONS {
        ObjectId _id PK
        ObjectId requirementId FK
        ObjectId supplierId FK
        Number quotedPrice
        Number quantity
        Number deliveryTime
        String deliveryUnit
        String qualityDetails
        String termsAndConditions
        Date validUntil
        String status
        Date submittedAt
        Date updatedAt
    }

    COMPATIBILITY_SCORES {
        ObjectId _id PK
        ObjectId requirementId FK
        ObjectId supplierId FK
        Number overallScore
        Number productMatchScore
        Number qualityScore
        Number priceScore
        Number locationScore
        Number availabilityScore
        Number performanceScore
        Date calculatedAt
    }

    RATINGS_FEEDBACK {
        ObjectId _id PK
        ObjectId vendorId FK
        ObjectId supplierId FK
        Number rating
        String feedback
        ObjectId dealId FK
        Date createdAt
        Date updatedAt
    }

    MARKET_INFO {
        ObjectId _id PK
        String category
        String material
        String industry
        Number currentPrice
        String priceUnit
        String demandLevel
        String supplyLevel
        String location
        String source
        Date recordedAt
    }

    MARKET_PREDICTIONS {
        ObjectId _id PK
        String material
        String category
        String industry
        Number currentPrice
        Number predictedPrice
        String predictionPeriod
        String trend
        Number confidenceScore
        String modelVersion
        Date predictedAt
    }

    DEALS_CONTRACTS {
        ObjectId _id PK
        ObjectId vendorId FK
        ObjectId supplierId FK
        ObjectId requirementId FK
        ObjectId quotationId FK
        Number agreedPrice
        Number quantity
        String termsAndConditions
        String status
        Date contractDate
        Date updatedAt
    }

    MESSAGES {
        ObjectId _id PK
        ObjectId senderId FK
        ObjectId receiverId FK
        ObjectId requirementId FK
        ObjectId dealId FK
        String message
        Boolean isRead
        Date sentAt
    }

    NOTIFICATIONS {
        ObjectId _id PK
        ObjectId userId FK
        String type
        String title
        String message
        ObjectId relatedRequirementId FK
        ObjectId relatedQuotationId FK
        ObjectId relatedDealId FK
        Boolean isRead
        Date createdAt
    }

    USERS ||--o| VENDOR_PROFILES : "has"
    USERS ||--o| SUPPLIER_PROFILES : "has"

    VENDOR_PROFILES ||--o{ REQUIREMENTS : "creates"
    SUPPLIER_PROFILES ||--o{ PRODUCTS_OFFERINGS : "offers"

    REQUIREMENTS ||--o{ QUOTATIONS : "receives"
    SUPPLIER_PROFILES ||--o{ QUOTATIONS : "submits"

    REQUIREMENTS ||--o{ COMPATIBILITY_SCORES : "has"
    SUPPLIER_PROFILES ||--o{ COMPATIBILITY_SCORES : "gets"

    VENDOR_PROFILES ||--o{ RATINGS_FEEDBACK : "gives"
    SUPPLIER_PROFILES ||--o{ RATINGS_FEEDBACK : "receives"

    VENDOR_PROFILES ||--o{ DEALS_CONTRACTS : "makes"
    SUPPLIER_PROFILES ||--o{ DEALS_CONTRACTS : "enters"
    REQUIREMENTS ||--o{ DEALS_CONTRACTS : "leads_to"
    QUOTATIONS ||--o| DEALS_CONTRACTS : "forms"

    USERS ||--o{ MESSAGES : "sends"
    USERS ||--o{ MESSAGES : "receives"

    REQUIREMENTS ||--o{ MESSAGES : "relates_to"
    DEALS_CONTRACTS ||--o{ MESSAGES : "relates_to"

    USERS ||--o{ NOTIFICATIONS : "receives"
    REQUIREMENTS ||--o{ NOTIFICATIONS : "relates_to"
    QUOTATIONS ||--o{ NOTIFICATIONS : "relates_to"
    DEALS_CONTRACTS ||--o{ NOTIFICATIONS : "relates_to"

    MARKET_INFO ||--o{ MARKET_PREDICTIONS : "supports"
