// src/routes/user.routes.js

const express = require("express");
const router = express.Router();

const UserController = require("../controllers/user.controller");
const { authenticateUser } = require("../middleware/auth.middleware");
const validate = require("../middleware/validation.middleware");

const { AppWrapper } = require("./App Wrapper/AppWrapper/AppWrapper");
const { ACCESS_ROLES } = require("./App Wrapper/Constants/roles");

const {
  updateRoleSchema,
  updateStatusSchema,
} = require("../validators/user.validator");

// helper to ensure controller return is sent as JSON
const sendJson = (fn) => async (req, res, next) => {
  try {
    const result = await fn(req, res, next);
    if (!res.headersSent && result !== undefined) return res.json(result);
    return;
  } catch (err) {
    return next(err);
  }
};

// 🔐 All routes require authentication
router.use(authenticateUser);

// 👤 Any logged-in user
router.get(
  "/profile",
  AppWrapper(sendJson(UserController.getProfile), [ACCESS_ROLES.ALL])
);

// 👮 Admin / Manager
router.get(
  "/",
  AppWrapper(sendJson(UserController.getAll), [ACCESS_ROLES.ADMIN, ACCESS_ROLES.MANAGER])
);

router.get(
  "/:id",
  AppWrapper(sendJson(UserController.getById), [ACCESS_ROLES.ADMIN, ACCESS_ROLES.MANAGER])
);

// 👑 Admin only
router.patch(
  "/:id/role",
  validate(updateRoleSchema),
  AppWrapper(sendJson(UserController.updateRole), [ACCESS_ROLES.ADMIN])
);

router.patch(
  "/:id/status",
  validate(updateStatusSchema),
  AppWrapper(sendJson(UserController.updateStatus), [ACCESS_ROLES.ADMIN])
);

router.delete(
  "/:id",
  AppWrapper(sendJson(UserController.deactivate), [ACCESS_ROLES.ADMIN])
);

module.exports = router;
