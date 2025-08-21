const ApiResponse = require("../helpers/ApiResponse");

const notFound = (req, res) => {
  return ApiResponse.fail(
    res,
    "Route not found",
    { path: req.originalUrl },
    404
  );
};

const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
    console.error("Error:", err);
  }

  const status = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const error =
    process.env.NODE_ENV !== "production"
      ? { message, stack: err.stack, name: err.name }
      : { message };

  return ApiResponse.fail(res, message, error, status);
};

module.exports = { notFound, errorHandler };
