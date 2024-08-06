const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authentication"); // Import the authentication middleware

const {
  createRolePermission,
  deleteRolePermission,
  getAllRolePermissions,
  updateRolePermission,
  getRolePermission,
} = require("../controllers/RolePermissions");

// Apply authentication middleware to all routes in this router
// router.use(authenticate);

// Role permissions routes
router.route("/").post(createRolePermission).get(getAllRolePermissions);

router
  .route("/:id")
  .get(getRolePermission)
  .patch(updateRolePermission)
  .delete(deleteRolePermission);

module.exports = router;
