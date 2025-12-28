const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isImage = file.mimetype.startsWith("image/");

    return {
      folder: "uploads",
      resource_type: isImage ? "image" : "raw",

      
      access_mode: "public",

      // SAFE NAME (prevents PDF bugs)
      public_id: `${Date.now()}-${file.originalname
        .replace(/\s+/g, "_")
        .replace(/[^\w.-]/g, "")}`,
    };
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});

module.exports = upload;
