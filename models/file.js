const mongoose = require("mongoose");
const fileSchema = new mongoose.Schema({
  originalName: String,
  fileName: String,
  fileType: String,
  size: Number,
  path: String
}, { timestamps: true });

module.exports = mongoose.model("File", fileSchema);