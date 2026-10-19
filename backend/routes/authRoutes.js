const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/auth");

const router = express.Router();

function makeToken(user) {
  if (
    !process.env.JWT_SECRET ||
    process.env.JWT_SECRET.includes("replace_this")
  ) {
    throw new Error("Please set a valid JWT_SECRET in your .env file.");
  }

  return jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    location: user.location,
    industry: user.industry
  };
}

router.post("/register", async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      role,
      location = "",
      industry = "Other"
    } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "name, email, password and role are required."
      });
    }

    if (!["vendor", "supplier"].includes(String(role).toLowerCase())) {
      return res.status(400).json({
        message: "role must be vendor or supplier."
      });
    }

    if (String(name).trim().length < 2 || String(name).trim().length > 80) {
      return res.status(400).json({
        message: "Name must contain between 2 and 80 characters."
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({
        message: "Please enter a valid email address."
      });
    }

    if (String(password).length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long."
      });
    }

    const validIndustries = ["Textile", "Steel", "Wood", "Other"];

    const selectedIndustry = validIndustries.find(
      item => item.toLowerCase() === String(industry).trim().toLowerCase()
    );

    if (!selectedIndustry) {
      return res.status(400).json({
        message: "Industry must be Textile, Steel, Wood or Other."
      });
    }

    const existing = User.findOne({ email: normalizedEmail });

    if (existing) {
      return res.status(409).json({
        message: "An account with this email already exists."
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      passwordHash,
      role: String(role).toLowerCase(),
      location: String(location).trim(),
      industry: selectedIndustry
    });

    return res.status(201).json({
      message: "Registration successful.",
      token: makeToken(user),
      user: publicUser(user)
    });
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({
        message: "An account with this email already exists."
      });
    }

    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "email and password are required."
      });
    }

    const user = User.findOne({
      email: String(email).trim().toLowerCase()
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password."
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (
      !passwordMatches ||
      (role && String(role).toLowerCase() !== user.role)
    ) {
      return res.status(401).json({
        message: "Invalid email, password or selected role."
      });
    }

    return res.json({
      message: "Login successful.",
      token: makeToken(user),
      user: publicUser(user)
    });
  } catch (error) {
    next(error);
  }
});

router.get("/me", protect, (req, res) => {
  res.json({
    user: publicUser(req.user)
  });
});

module.exports = router;