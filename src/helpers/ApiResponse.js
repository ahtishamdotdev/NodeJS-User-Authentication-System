
class ApiResponse {
  static success(res, message = "OK", data = null, statusCode = 200) {
    return res
      .status(statusCode)
      .json({ success: true, message, data, error: null });
  }

  static fail(res, message = "Error", error = null, statusCode = 400) {
    return res
      .status(statusCode)
      .json({ success: false, message, data: null, error });
  }
}

module.exports = ApiResponse;
