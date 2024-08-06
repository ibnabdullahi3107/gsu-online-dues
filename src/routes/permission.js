const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authentication"); // Import the authentication middleware

const {
  createPermission,
  deletePermission,
  getAllPermissions,
  updatePermission,
  getPermission,
} = require("../controllers/Permission");


// Apply authentication middleware to all routes in this router
// router.use(authenticate);

// Permissions routes
router.route("/").post(createPermission).get(getAllPermissions);

router
  .route("/:id")
  .get(getPermission)
  .patch(updatePermission)
  .delete(deletePermission);

module.exports = router;
