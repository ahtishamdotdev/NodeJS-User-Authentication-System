const { Joi } = require("../middlewares/validate");
const ApiResponse = require("../helpers/ApiResponse");
const catchAsync = require("../helpers/catchAsync");
const User = require("../models/User");
const { logActivity } = require("../services/activityService");

const updateMeSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  email: Joi.string().email().optional(), 
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().min(6).required(),
  newPassword: Joi.string().min(6).max(128).required(),
});


exports.getMe = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id);
  return ApiResponse.success(res, "Profile", { user });
});


exports.updateMe = catchAsync(async (req, res) => {
  const { name, email } = req.body;

  const update = {};
  if (name) update.name = name;
  if (email) update.email = email.toLowerCase();

  
  if (email) {
    const exists = await User.findOne({
      _id: { $ne: req.user.id },
      email: email.toLowerCase(),
    });
    if (exists) return ApiResponse.fail(res, "Email already in use", null, 409);
  }

  const user = await User.findByIdAndUpdate(req.user.id, update, { new: true });
  await logActivity({
    userId: req.user.id,
    action: "user.update_self",
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    metadata: { fields: Object.keys(update) },
  });

  return ApiResponse.success(res, "Profile updated", { user });
});


exports.changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select("+password");
  if (!user) return ApiResponse.fail(res, "User not found", null, 404);

  const ok = await user.comparePassword(currentPassword);
  if (!ok)
    return ApiResponse.fail(res, "Current password incorrect", null, 400);

  user.password = newPassword;
  await user.save();

  await logActivity({
    userId: req.user.id,
    action: "user.change_password",
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });

  return ApiResponse.success(res, "Password changed");
});


exports.softDeleteMe = catchAsync(async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { isDeleted: true });
  await logActivity({
    userId: req.user.id,
    action: "user.soft_delete",
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });
  return ApiResponse.success(res, "Account soft-deleted");
});

exports.schemas = { updateMeSchema, changePasswordSchema };
