const express = require("express");
const fs = require("fs");
const path = require("path");
const File = require("../models/file");
const upload = require("../middlewares/upload");
const router = express.Router();

// Upload file

router.post("/upload", upload.single("file"), async (req, res) => {
  const file = await File.create({
    originalName: req.file.originalname,
    fileName: req.file.filename,
    fileType: req.file.mimetype,
    size: req.file.size,
    path: req.file.path,
  });

  res.json({
    message: "File uploaded successfully",
    file,
  });
});

//   get all files

router.get("/", async (req, res) => {
  const files = await File.find().sort({ createdAt: -1 });
  res.json(files);
});

//   download file

router.get("/download/:id", async (req, res) => {
  const file = await File.findById(req.params.id);
  if (!file) return res.status(404).json({ message: "File not found" });

  res.download(path.join(__dirname, "..", file.path), file.originalName);
});

//  delete file

router.delete("/:id", async (req, res) => {
  const file = await File.findById(req.params.id);
  if (!file) return res.status(404).json({ message: "File not found" });

  fs.unlinkSync(path.join(__dirname, "..", file.path));
  await file.deleteOne();

  res.json({ message: "File deleted successfully" });
});

module.exports = router;
