const jwt = require("jsonwebtoken");
const ApiResponse = require("../helpers/ApiResponse");
const User = require("../models/User");

module.exports = async function auth(req, res, next) {
  try {
    
    let token;
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return ApiResponse.fail(
        res,
        "Not authenticated",
        { reason: "Missing access token" },
        401
      );
    }

    
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {
      issuer: process.env.JWT_ISSUER,
    });

    
    const user = await User.findById(payload.sub);
    if (!user || user.isDeleted) {
      return ApiResponse.fail(res, "Account not available", null, 403);
    }

    req.user = {
      id: user._id.toString(),
      role: user.role,
      email: user.email,
      name: user.name,
    };
    next();
  } catch (err) {
    return ApiResponse.fail(
      res,
      "Invalid or expired token",
      { name: err.name },
      401
    );
  }
};
