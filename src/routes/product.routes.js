const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  // attachUserInfo,  // ❌ REMOVE THIS - doesn't exist
  isAdmin,
  isAdminOrManager,
} = require("../middleware/auth.middleware");
const {
  updateRoleSchema,
  updateStatusSchema,
} = require("../validators/user.validator");

const ProductController = require("../controllers/product.controller");

router.use(authenticateUser);

// Current user profile (any authenticated user)
router.post("/create", ProductController.create)


module.exports = router;
