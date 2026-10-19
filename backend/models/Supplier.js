const db = require("../config/db");

function formatSupplier(row) {
  if (!row) return null;

  return {
    ...row,
    _id: row.id,
    materials: JSON.parse(row.materials),
    isActive: Boolean(row.isActive)
  };
}

function findAll(filters = {}) {
  let suppliers = db
    .prepare("SELECT * FROM suppliers WHERE isActive = 1")
    .all()
    .map(formatSupplier);

  if (filters.industry) {
    suppliers = suppliers.filter(
      s => s.industry.toLowerCase() === String(filters.industry).toLowerCase()
    );
  }

  if (filters.material) {
    const material = String(filters.material).trim().toLowerCase();

    suppliers = suppliers.filter(
      s => s.materials.includes(material)
    );
  }

  if (filters.location) {
    const location = String(filters.location).trim().toLowerCase();

    suppliers = suppliers.filter(
      s => s.location.toLowerCase().includes(location)
    );
  }

  return suppliers.sort(
    (a, b) => b.rating - a.rating || a.pricePerUnit - b.pricePerUnit
  );
}

function findMatching({ industry, material, quantity }) {
  return findAll({ industry, material }).filter(
    supplier => supplier.availableQuantity >= quantity
  );
}

function create(data) {
  const statement = db.prepare(`
    INSERT INTO suppliers (
      userId, name, companyName, industry, materials,
      pricePerUnit, qualityScore, deliveryDays, rating,
      availableQuantity, location, isActive
    )
    VALUES (
      @userId, @name, @companyName, @industry, @materials,
      @pricePerUnit, @qualityScore, @deliveryDays, @rating,
      @availableQuantity, @location, 1
    )
  `);

  const result = statement.run({
    userId: data.userId || null,
    name: data.name,
    companyName: data.companyName,
    industry: data.industry,
    materials: JSON.stringify(
      data.materials.map(m => String(m).trim().toLowerCase())
    ),
    pricePerUnit: Number(data.pricePerUnit),
    qualityScore: Number(data.qualityScore),
    deliveryDays: Number(data.deliveryDays),
    rating: Number(data.rating ?? 0),
    availableQuantity: Number(data.availableQuantity),
    location: data.location
  });

  const row = db
    .prepare("SELECT * FROM suppliers WHERE id = ?")
    .get(result.lastInsertRowid);

  return formatSupplier(row);
}

function seed(sampleSuppliers) {
  const remove = db.prepare(
    "DELETE FROM suppliers WHERE companyName = ?"
  );

  const insert = db.prepare(`
    INSERT INTO suppliers (
      name, companyName, industry, materials,
      pricePerUnit, qualityScore, deliveryDays, rating,
      availableQuantity, location, isActive
    )
    VALUES (
      @name, @companyName, @industry, @materials,
      @pricePerUnit, @qualityScore, @deliveryDays, @rating,
      @availableQuantity, @location, 1
    )
  `);

  const seedTransaction = db.transaction(() => {
    for (const supplier of sampleSuppliers) {
      remove.run(supplier.companyName);

      insert.run({
        ...supplier,
        materials: JSON.stringify(
          supplier.materials.map(m => String(m).trim().toLowerCase())
        )
      });
    }
  });

  seedTransaction();

  return sampleSuppliers.length;
}

module.exports = { findAll, findMatching, create, seed };