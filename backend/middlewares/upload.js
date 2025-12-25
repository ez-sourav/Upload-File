const multer = require("multer");
const path = require("path");

// STORAGE
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

// FILE FILTER – allow everything
const fileFilter = (req, file, cb) => {
  // Accept ALL files
  cb(null, true);
};

// MULTER CONFIG
const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB
  },
  fileFilter,
});

module.exports = upload;
