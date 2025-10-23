// viviana-backend/routes/categoryRoutes.js
const express = require("express");
const router = express.Router();
const {
  getCategories,
  createCategory,
  deleteCategory,
  updateCategory,
} = require("../controllers/categoryController");

router.put("/:id", updateCategory);

router.get("/", getCategories);
router.post("/", createCategory); 
router.delete("/:id", deleteCategory);

module.exports = router;

