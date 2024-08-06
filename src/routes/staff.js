// routes/staff.js
const express = require("express");
const { createStaff, getAllStaffs } = require("../controllers/Staff");
const authenticate = require("../middlewares/authentication");
const checkRole = require("../middlewares/role-handler");
const checkPermission = require("../middlewares/permission-handler");

const router = express.Router();

// Middleware for authentication
router.use(authenticate);

router
  .route(
    "/",
    checkRole(["admin", "Super Admin"]),
    checkPermission(["view_students"])
  )
  .post(createStaff)
  .get(getAllStaffs);

module.exports = router;
