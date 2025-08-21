const jwt = require("jsonwebtoken");
const { sha256 } = require("../helpers/crypto");
const RefreshToken = require("../models/RefreshToken");

const ACCESS_EXP = process.env.ACCESS_TOKEN_EXPIRES || "15m";
const REFRESH_EXP = process.env.REFRESH_TOKEN_EXPIRES || "7d";

function signAccessToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_EXP, issuer: process.env.JWT_ISSUER }
  );
}

function signRefreshToken(user) {
  
  return jwt.sign(
    { sub: user._id.toString(), type: "refresh" },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_EXP, issuer: process.env.JWT_ISSUER }
  );
}

function cookieOptions(maxAgeMs) {
  return {
    httpOnly: true,
    secure: String(process.env.COOKIE_SECURE) === "true",
    sameSite: process.env.COOKIE_SAMESITE || "lax",
    domain: process.env.COOKIE_DOMAIN || undefined,
    maxAge: maxAgeMs,
    path: "/",
  };
}

async function persistRefreshToken(token, req) {
  const payload = jwt.decode(token);
  const tokenHash = sha256(token);
  const expiresAt = new Date(payload.exp * 1000);

  await RefreshToken.create({
    user: payload.sub,
    tokenHash,
    userAgent: req.get("User-Agent"),
    ip: req.ip,
    expiresAt,
  });

  return { tokenHash, expiresAt };
}

async function revokeRefreshToken(rawToken) {
  const tokenHash = sha256(rawToken);
  await RefreshToken.updateOne(
    { tokenHash },
    { $set: { revokedAt: new Date() } }
  );
}

async function rotateRefreshToken(oldToken, req) {
  
  const payload = jwt.verify(oldToken, process.env.REFRESH_TOKEN_SECRET, {
    issuer: process.env.JWT_ISSUER,
  });

  const tokenHash = sha256(oldToken);
  const tokenDoc = await RefreshToken.findOne({
    tokenHash,
    user: payload.sub,
    revokedAt: null,
  });
  if (!tokenDoc)
    throw Object.assign(new Error("Refresh token not found or revoked"), {
      statusCode: 401,
    });

  
  const accessToken = signAccessToken({
    _id: payload.sub,
    role: payload.role || "user",
  });
  const refreshToken = signRefreshToken({
    _id: payload.sub,
    role: payload.role || "user",
  });

  
  tokenDoc.revokedAt = new Date();
  await tokenDoc.save();
  await persistRefreshToken(refreshToken, req);

  return { accessToken, refreshToken };
}

function setAuthCookies(res, accessToken, refreshToken) {
  
  const fifteenMin = 15 * 60 * 1000;
  const sevenDays = 7 * 24 * 60 * 60 * 1000;

  res.cookie("accessToken", accessToken, cookieOptions(fifteenMin));
  res.cookie("refreshToken", refreshToken, cookieOptions(sevenDays));
}

function clearAuthCookies(res) {
  res.clearCookie("accessToken", { path: "/" });
  res.clearCookie("refreshToken", { path: "/" });
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  setAuthCookies,
  clearAuthCookies,
  persistRefreshToken,
  revokeRefreshToken,
  rotateRefreshToken,
};
