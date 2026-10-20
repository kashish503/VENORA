# VENORA — Connected Frontend + Existing Backend

This bundle combines the designed React/Vite UI with the supplied Express/MongoDB backend. The frontend uses real backend endpoints for registration, login, supplier directory, supplier listing, and rule-based supplier matching; matching results are not hardcoded.

## Requirements
- Node.js LTS and npm
- MongoDB Atlas or local MongoDB

## 1. Configure and start backend
Open a terminal in `backend`:

```bash
npm install
```

Copy `backend/.env.example` to `backend/.env`, then set your real `MONGODB_URI` and a long random `JWT_SECRET`. Keep `.env` private. Do not share it or upload it to GitHub.

Start the backend:

```bash
npm run dev
```

Wait for `Connected to MongoDB` and `VENORA backend running at http://localhost:5000`. Open http://localhost:5000/api/health and expect `{"status":"ok","service":"VENORA backend"}`.

In a second terminal in `backend`, optionally add demo suppliers:

```bash
npm run seed
```

Run the seed command only after MongoDB is configured and the backend can connect.

## 2. Start frontend
Open a second terminal in `frontend`:

```bash
npm install
```

The default API URL is `http://localhost:5000`. If needed, copy `frontend/.env.example` to `frontend/.env` and set:

```env
VITE_API_URL=http://localhost:5000
```

Then run:

```bash
npm run dev
```

Open the URL printed by Vite (normally http://localhost:5173). Keep both terminal windows running.

## 3. Test the app
1. Wait until the sign-in screen reports that the backend is connected.
2. Create an account and choose either **Vendor** or **Supplier**.
3. Vendor: open Find Suppliers, choose an exact material tag such as `cotton`, set quantity and maximum price per unit, then run matching.
4. Supplier: publish an offering. Sign in as a Vendor in another account to test matching against that catalogue entry.
5. Supplier directory reads live data from `GET /api/suppliers`.

The sample seed materials are exact tags: `cotton`, `cotton fabric`, `steel`, `steel rods`, `wood`, and `timber`.

## Backend/UI compatibility notes
- API base URL is configured by `VITE_API_URL` in the frontend.
- Backend CORS defaults to `http://localhost:5173`; if Vite uses a different port, set `CLIENT_ORIGIN` in `backend/.env` to the exact frontend origin and restart the backend.
- Registration and login use the backend's JWT response; the token is stored in browser local storage and sent as a Bearer token to protected routes.
- Matching is rule-based, not a trained AI/ML model. It ranks eligible suppliers using price (35%), quality (35%), delivery (20%), and rating (10%).
- `maxBudget` is treated by the backend as the maximum **price per unit**, not the total order budget.
- Industry and material tags must match the backend's exact values. Quantity must be available and unit price must not exceed the cap. Location is currently displayed/submitted but is not a hard matching filter in this backend.
- The backend does not have a separate saved-requirements endpoint; matching submits the form directly to `POST /api/matching`.

## Troubleshooting
- **Backend won't start:** check `backend/.env`, MongoDB URI/network access, and `JWT_SECRET`.
- **API offline in UI:** start backend first and open `/api/health` directly.
- **CORS error:** check `CLIENT_ORIGIN` matches the frontend origin exactly.
- **No matches:** run `npm run seed`, then use a seed material tag and ensure the requested quantity/price fits a supplier.
- **Supplier publish denied:** log in with a Supplier account; the endpoint requires supplier role.
