const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many auth attempts. Try later.",
});

module.exports = { authLimiter };
