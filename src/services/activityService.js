const ActivityLog = require("../models/ActivityLog");

async function logActivity({ userId, action, ip, userAgent, metadata }) {
  try {
    await ActivityLog.create({
      user: userId || null,
      action,
      ip,
      userAgent,
      metadata: metadata || {},
    });
  } catch (e) {
    
    if (process.env.NODE_ENV !== "production") {
      console.warn("Activity log failed:", e.message);
    }
  }
}

module.exports = { logActivity };
