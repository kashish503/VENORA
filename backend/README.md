# VENORA Backend (Prototype)

This folder contains a starter backend for the VENORA demo:
- Vendor/supplier registration and login
- Password hashing with bcrypt
- JWT-based authentication
- Supplier catalogue API
- Rule-based top-3 supplier matching API

## 1. Requirements
- Node.js (LTS recommended)
- MongoDB Atlas cluster or local MongoDB
- npm

## 2. Install
Open a terminal in the `backend` folder and run:

```bash
npm install
```

## 3. Configure environment
1. Copy `.env.example` to `.env`.
2. Replace `MONGODB_URI` with your own MongoDB connection string.
3. Replace `JWT_SECRET` with a long random secret.
4. Keep `.env` private; do not commit it to GitHub.

## 4. Start server
```bash
npm run dev
```
or:
```bash
npm start
```

Expected message after successful database connection:
`VENORA backend running at http://localhost:5000`

Check `http://localhost:5000/api/health`.

## 5. Add sample suppliers
In a second terminal, while in this folder:

```bash
npm run seed
```

This inserts sample suppliers for demo testing. Run it only after MongoDB is configured.

## 6. API endpoints

### Register
`POST /api/auth/register`

```json
{
  "name": "Kashish Demo",
  "email": "vendor@example.com",
  "password": "DemoPass123",
  "role": "vendor",
  "location": "Jaipur",
  "industry": "Textile"
}
```

For supplier accounts use `"role": "supplier"`.

### Login
`POST /api/auth/login`

```json
{
  "email": "vendor@example.com",
  "password": "DemoPass123",
  "role": "vendor"
}
```

Copy the returned token. For protected endpoints add this HTTP header:

`Authorization: Bearer YOUR_TOKEN`

### Current user
`GET /api/auth/me` (requires token)

### List suppliers
`GET /api/suppliers`

Optional query parameters: `industry`, `material`, `location`.

### Create supplier catalogue entry
`POST /api/suppliers` (requires a logged-in supplier account)

```json
{
  "name": "Demo Supplier",
  "companyName": "Demo Textiles",
  "industry": "Textile",
  "materials": ["cotton"],
  "pricePerUnit": 180,
  "qualityScore": 9,
  "deliveryDays": 3,
  "rating": 4.5,
  "availableQuantity": 1000,
  "location": "Jaipur"
}
```

### Rule-based matching
`POST /api/matching` (requires a logged-in vendor account)

```json
{
  "industry": "Textile",
  "material": "cotton",
  "quantity": 500,
  "maxBudget": 200,
  "minQuality": 8,
  "maxDeliveryDays": 10,
  "location": "Jaipur"
}
```

The endpoint filters by industry, material, sufficient quantity and budget. It then ranks eligible suppliers using:
- Price: 35%
- Quality: 35%
- Delivery time: 20%
- Supplier rating: 10%

The location is returned as part of the requirement but is not yet used as a hard filter in this prototype. This can be added later if required. Matching is rule-based scoring, not a trained machine-learning model.

## 7. Important
- This is a prototype, not production-ready software.
- Do not use real passwords in demo screenshots.
- Do not share your MongoDB password or `.env` file.
- Frontend requests should use `http://localhost:5000` as the API base URL.
