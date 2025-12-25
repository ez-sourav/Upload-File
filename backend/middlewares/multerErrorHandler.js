const multer = require("multer");

module.exports = (err, req, res, next) => {
  // Multer-specific errors
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        error: "File too large. Maximum size allowed is 2MB"
      });
    }

    return res.status(400).json({
      error: err.message
    });
  }

  // Other errors (like file type error)
  if (err) {
    return res.status(400).json({
      error: err.message || "File upload failed"
    });
  }

  next();
};
