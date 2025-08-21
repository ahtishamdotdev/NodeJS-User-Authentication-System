const router = require("express").Router();
const validate = require("../middlewares/validate");
const auth = require("../middlewares/auth");
const role = require("../middlewares/roles");
const ctrl = require("../controllers/adminController");


router.get(
  "/users",
  auth,
  role("admin"),
  validate(ctrl.schemas.listUsersSchema, "query"),
  ctrl.getUsers
);


router.patch(
  "/users/:id/role",
  auth,
  role("admin"),
  validate(ctrl.schemas.setRoleSchema),
  ctrl.setUserRole
);


router.delete("/users/:id", auth, role("admin"), ctrl.softDeleteUser);


router.get("/logs", auth, role("admin"), ctrl.getLogs);

module.exports = router;
