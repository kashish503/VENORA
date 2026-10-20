# VENORA Frontend (Backend-Connected MVP)

This is the React + Vite frontend prepared against the API routes in the supplied `VENORA_Backend` project. It does **not** use fake local matching results: registration, login, supplier listings and supplier matching call the backend.

## Features

- Register and sign in as Vendor or Supplier
- Vendor workspace with an industry/material/quantity/price-cap/quality/delivery/location requirement form
- Top-three match results using the backend's `compatibilityScore` and `scoreBreakdown`
- Result details for company, material, price per unit, estimated total cost, quality, rating, delivery, quantity available and location
- Supplier workspace to publish a supplier catalogue listing
- Supplier directory loaded from the backend
- API connection/error states and session restoration using the JWT returned by the backend
- Responsive desktop and mobile layout

## Requirements

- Node.js LTS and npm
- The VENORA Express backend running at `http://localhost:5000`
- MongoDB connected through the backend's private `.env`

## Start the backend first

Use the teammate's backend folder, not this frontend folder:

```bash
npm install
```

Create `.env` from `.env.example`, set `MONGODB_URI` and `JWT_SECRET`, and keep `.env` private. Then start the backend:

```bash
npm run dev
```

Check `http://localhost:5000/api/health` and make sure it returns a healthy status.

In a second terminal in the backend folder, seed the demo catalogue after MongoDB is configured:

```bash
npm run seed
```

The seed data uses exact material tags. Suggested matching examples are:

- Textile: `cotton` or `cotton fabric`
- Steel: `steel` or `steel rods`
- Wood: `wood` or `timber`

Register your own demo Vendor account in the frontend. The example Textile search is prefilled with values that are compatible with the seed catalogue.

## Start the frontend

Open a terminal in this `frontend` folder and run:

```bash
npm install
npm run dev
```

Open the URL printed by Vite (configured as `http://localhost:5173`). The backend allows this origin by default. To use a different backend URL, copy `.env.example` to `.env` and set:

```env
VITE_API_URL=http://localhost:5000
```

Restart Vite after changing `.env`.

## API compatibility

| Frontend action | Backend endpoint | Authentication |
|---|---|---|
| Check server | `GET /api/health` | Public |
| Register | `POST /api/auth/register` | Public |
| Login | `POST /api/auth/login` | Public |
| Restore session | `GET /api/auth/me` | Bearer token |
| Load catalogue | `GET /api/suppliers` | Public |
| Publish supplier listing | `POST /api/suppliers` | Supplier Bearer token |
| Match suppliers | `POST /api/matching` | Vendor Bearer token |

## Important backend behavior (reflected in the UI)

- Registration sends `name`, `email`, `password`, `role`, `location` and `industry`. Backend registration requires passwords to be at least 8 characters.
- Matching expects `industry`, `material`, `quantity`, `maxBudget`, `minQuality`, `maxDeliveryDays` and `location`.
- In the supplied backend, `maxBudget` is compared against each supplier's `pricePerUnit`. Therefore the UI labels it **Max price per unit**, not total project budget. The API's field name remains `maxBudget`.
- The backend requires an exact industry and exact lower-case material tag match, as well as sufficient available quantity and a unit price no greater than `maxBudget`.
- The backend scores eligible suppliers as Price 35%, Quality 35%, Delivery 20%, and Supplier rating 10%. It prefers suppliers meeting the requested quality threshold when ranking. `maxDeliveryDays` affects the score but is not currently an eligibility filter.
- The submitted location is returned by the matching API but is not currently used as a hard filter or scoring factor. The UI states this clearly.
- The supplied backend does not currently expose a Requirements create/list endpoint, so this prototype submits the form directly to the matching API; it does not save a separate Requirements document.
- Supplier listings are stored in the backend `Supplier` collection; the existing API does not associate a listing with the supplier user account.
- Matching is transparent rule-based scoring, not a trained machine-learning model.
- The backend stores `qualityScore` on a 0–10 scale and `rating` on a 0–5 scale; the frontend displays them separately.

## Troubleshooting

- **Cannot reach backend:** confirm the backend terminal is running and `/api/health` responds on port 5000.
- **CORS error:** run Vite at `http://localhost:5173` or update the backend `CLIENT_ORIGIN` to the exact frontend origin.
- **No supplier matches:** run `npm run seed` in the backend folder, then select an exact material tag (for example, `cotton`) and make sure price/quantity criteria are sufficient.
- **Login doesn't work:** register a demo account first. The UI doesn't include hardcoded demo passwords.
- **Supplier listing fails:** sign in with the Supplier role. Only a supplier JWT can call `POST /api/suppliers`.

## Security note

Never put the MongoDB connection string, JWT secret, or real credentials in the frontend, `.env.example`, screenshots, or GitHub. Frontend code is visible to users; it must never contain server secrets.
