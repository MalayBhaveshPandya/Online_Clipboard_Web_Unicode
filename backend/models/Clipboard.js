const mongoose = require("mongoose");

const clipboardSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  // Optional recipient - if set only that user can retrieve
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: false },
  text: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  tags: [String],
  expiry: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Clipboard", clipboardSchema);
