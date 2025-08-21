const Joi = require("joi");
const ApiResponse = require("../helpers/ApiResponse");

module.exports =
  (schema, property = "body") =>
  (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      const details = error.details.map((d) => ({
        path: d.path.join("."),
        message: d.message,
      }));
      return ApiResponse.fail(res, "Validation error", details, 422);
    }
    req[property] = value;
    next();
  };


module.exports.Joi = Joi;
