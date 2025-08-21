const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    action: { type: String, required: true },
    ip: { type: String },
    userAgent: { type: String },
    metadata: { type: Object, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ActivityLog", activityLogSchema);
