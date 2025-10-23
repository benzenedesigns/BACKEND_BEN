const db = require("../config/db");

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM categories");
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });

    const trimmedName = name.trim().toLowerCase();

    const [existing] = await db.query(
      "SELECT id FROM categories WHERE LOWER(name) = ?",
      [trimmedName]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: "Category name already exists" });
    }

    const [result] = await db.query(
      "INSERT INTO categories (name, description) VALUES (?, ?)",
      [name, description || null]
    );

    res.status(201).json({ id: result.insertId, name, description });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM categories WHERE id = ?", [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Edit/update a category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name) return res.status(400).json({ error: "Name is required" });

    const trimmedName = name.trim().toLowerCase();

    const [existing] = await db.query(
      "SELECT id FROM categories WHERE LOWER(name) = ? AND id != ?",
      [trimmedName, id]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: "Another category with this name exists" });
    }

    await db.query(
      "UPDATE categories SET name = ?, description = ? WHERE id = ?",
      [name, description || null, id]
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
