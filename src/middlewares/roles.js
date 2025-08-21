const ApiResponse = require("../helpers/ApiResponse");

module.exports =
  (...allowed) =>
  (req, res, next) => {
    if (!req.user) {
      return ApiResponse.fail(res, "Not authenticated", null, 401);
    }
    if (!allowed.includes(req.user.role)) {
      return ApiResponse.fail(
        res,
        "Forbidden: insufficient role",
        { required: allowed },
        403
      );
    }
    next();
  };
