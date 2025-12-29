const express = require("express");
const axios = require("axios");
const File = require("../models/file");
const upload = require("../middlewares/upload");
const cloudinary = require("../config/cloudinary");

const router = express.Router();

// ================= UPLOAD =================
router.post("/upload", upload.single("file"), async (req, res) => {
  const file = await File.create({
    originalName: req.file.originalname,
    fileName: req.file.filename,
    fileType: req.file.mimetype,
    size: req.file.size,
    fileUrl: req.file.path,        // Cloudinary URL
    publicId: req.file.filename,   // EXACT public_id
  });

  res.json({
    message: "File uploaded successfully",
    file,
  });
});

// ================= GET FILES =================
router.get("/", async (req, res) => {
  const files = await File.find().sort({ createdAt: -1 });
  res.json(files);
});

// ================= DOWNLOAD  =================
router.get("/download/:id", async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ error: "File not found" });

    const response = await axios.get(file.fileUrl, {
      responseType: "stream",
    });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.originalName}"`
    );
    res.setHeader("Content-Type", file.fileType);

    response.data.pipe(res);
  } catch (err) {
    console.error("DOWNLOAD ERROR:", err.message);
    res.status(500).json({ error: "Download failed" });
  }
});

// ================= DELETE =================
router.delete("/:id", async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ error: "File not found" });

    await cloudinary.uploader.destroy(file.publicId);
    await file.deleteOne();

    res.json({ message: "File deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete file" });
  }
});

module.exports = router;
