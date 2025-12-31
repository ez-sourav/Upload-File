const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    originalName: String,
    fileName: String,
    fileType: String,
    size: Number,

    fileUrl: String,   // Cloudinary URL
    publicId: String,  // Cloudinary ID (for delete)

    // 🔐 OWNER OF THE FILE
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("File", fileSchema);
