const crypto = require("crypto");


const randomToken = (size = 48) => crypto.randomBytes(size).toString("hex");


const sha256 = (value) =>
  crypto.createHash("sha256").update(value).digest("hex");


const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

module.exports = { randomToken, sha256, generateOtp };
