require("dotenv").config();

const express = require("express");
const cors = require("cors");

// SQLite database
const db = require("./config/db");

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "VENORA Backend is running"
    });
});

// Health check
app.get("/api/health", (req, res) => {
    res.json({
        status: "OK",
        message: "VENORA Backend is healthy"
    });
});

// Routes
try {
    const authRoutes = require("./routes/authRoutes");
    app.use("/api/auth", authRoutes);
} catch (error) {
    console.log("Auth routes not loaded:", error.message);
}

try {
    const supplierRoutes = require("./routes/supplierRoutes");
    app.use("/api/suppliers", supplierRoutes);
} catch (error) {
    console.log("Supplier routes not loaded:", error.message);
}

// Start server
app.listen(PORT, () => {
    console.log(`VENORA Backend running on http://localhost:${PORT}`);
});