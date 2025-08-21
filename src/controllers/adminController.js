const { Joi } = require("../middlewares/validate");
const ApiResponse = require("../helpers/ApiResponse");
const catchAsync = require("../helpers/catchAsync");
const User = require("../models/User");
const ActivityLog = require("../models/ActivityLog");

const listUsersSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  q: Joi.string().allow("", null).default(""),
  sort: Joi.string().valid("createdAt", "name", "email").default("createdAt"),
  order: Joi.string().valid("asc", "desc").default("desc"),
});

const setRoleSchema = Joi.object({
  role: Joi.string().valid("user", "admin").required(),
});


exports.getUsers = catchAsync(async (req, res) => {
  const { page, limit, q, sort, order } = req.query;

  const filter = {
    isDeleted: false,
    $or: [
      { name: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } },
    ],
  };

  const total = await User.countDocuments(filter);
  const users = await User.find(filter)
    .sort({ [sort]: order === "asc" ? 1 : -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  return ApiResponse.success(res, "Users list", {
    page: Number(page),
    limit: Number(limit),
    total,
    results: users,
  });
});


exports.setUserRole = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const user = await User.findByIdAndUpdate(id, { role }, { new: true });
  if (!user) return ApiResponse.fail(res, "User not found", null, 404);

  return ApiResponse.success(res, "Role updated", { user });
});


exports.softDeleteUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  if (!user) return ApiResponse.fail(res, "User not found", null, 404);

  return ApiResponse.success(res, "User soft-deleted", { user });
});


exports.getLogs = catchAsync(async (req, res) => {
  const { page = 1, limit = 20, user } = req.query;
  const filter = user ? { user } : {};
  const total = await ActivityLog.countDocuments(filter);
  const logs = await ActivityLog.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));
  return ApiResponse.success(res, "Activity logs", {
    page: Number(page),
    limit: Number(limit),
    total,
    results: logs,
  });
});

exports.schemas = { listUsersSchema, setRoleSchema };
