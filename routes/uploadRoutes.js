// viviana-backend/routes/uploadRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

router.post("/", upload.single("image"), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const fileUrl = `/uploads/${file.filename}`;
  res.json({ fileUrl });
});

module.exports = router;
