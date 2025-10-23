// viviana-backend/controllers/productController.js
const db = require("../config/db");

// 🟢 Helper: Parse MySQL images field
const parseImages = (images) => {
  try {
    return typeof images === "string" ? JSON.parse(images) : images || [];
  } catch {
    return [];
  }
};

exports.getProducts = async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM products");
    const parsedResults = results.map((product) => ({
      ...product,
      images: parseImages(product.images),
    }));
    res.json(parsedResults);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.addProduct = async (req, res) => {
  try {
    const { name, code, weight, capacity, dimensions, category, images } = req.body;
    const imageString = JSON.stringify(images || []);

    const [result] = await db.query(
      "INSERT INTO products (name, code, weight, capacity, dimensions, category, images) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, code, weight, capacity, dimensions, category, imageString]
    );

    res.json({
      id: result.insertId,
      name,
      code,
      weight,
      capacity,
      dimensions,
      category,
      images: parseImages(imageString),
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, weight, capacity, dimensions, category, images } = req.body;
    const imageString = JSON.stringify(images || []);

    await db.query(
      "UPDATE products SET name=?, code=?, weight=?, capacity=?, dimensions=?, category=?, images=? WHERE id=?",
      [name, code, weight, capacity, dimensions, category, imageString, id]
    );

    res.json({
      id,
      name,
      code,
      weight,
      capacity,
      dimensions,
      category,
      images: parseImages(imageString),
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM products WHERE id = ?", [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const [results] = await db.query("SELECT * FROM products WHERE id = ?", [id]);

    if (results.length === 0) return res.status(404).json({ message: "Product not found" });

    const product = results[0];
    product.images = parseImages(product.images);
    res.json(product);
  } catch (err) {
    res.status(500).json(err);
  }
};
