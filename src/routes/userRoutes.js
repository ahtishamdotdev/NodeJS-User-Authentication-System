const router = require("express").Router();
const validate = require("../middlewares/validate");
const auth = require("../middlewares/auth");
const ctrl = require("../controllers/userController");

router.get("/me", auth, ctrl.getMe);
router.patch("/me", auth, validate(ctrl.schemas.updateMeSchema), ctrl.updateMe);
router.patch(
  "/change-password",
  auth,
  validate(ctrl.schemas.changePasswordSchema),
  ctrl.changePassword
);
router.delete("/me", auth, ctrl.softDeleteMe);

module.exports = router;
