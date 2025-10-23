// viviana-backend/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { register, login, getMe } = require("../controllers/authController");
const verifyToken = require("../middleware/verifyToken");

router.post("/signup", register);  // ✅ for frontend signup
router.post("/login", login);
router.get("/me", verifyToken, getMe);  




module.exports = router;


