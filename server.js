// viviana-backend/server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const authRoutes = require("./routes/authRoutes");



dotenv.config();

const app = express();
app.use(express.json()); // 👈 This parses incoming JSON body

app.use(cors({
  origin: ['http://localhost:5174', 'http://localhost:5173'],
  credentials: true   // allow cookies and auth headers
}));

// ✅ Serve uploaded images as static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Mount routes
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/upload", uploadRoutes); // <-- this line is important
//  auth routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

