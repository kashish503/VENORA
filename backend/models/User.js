const db = require("../config/db");

function formatUser(row) {
if (!row) return null;

return {
...row,
_id: row.id
};
}

function findOne({ email }) {
const row = db
.prepare("SELECT * FROM users WHERE email = ?")
.get(String(email).trim().toLowerCase());

return formatUser(row);
}

function findById(id) {
const row = db
.prepare("SELECT * FROM users WHERE id = ?")
.get(Number(id));

return formatUser(row);
}

function create(user) {
const statement = db.prepare(`     INSERT INTO users (name, email, passwordHash, role, location, industry)
    VALUES (@name, @email, @passwordHash, @role, @location, @industry)
  `);

const result = statement.run({
name: user.name,
email: user.email,
passwordHash: user.passwordHash,
role: user.role,
location: user.location || "",
industry: user.industry || "Other"
});

return findById(result.lastInsertRowid);
}

module.exports = { findOne, findById, create };