const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authentication");
const checkRole = require("../middlewares/role-handler");
const checkPermission = require("../middlewares/permission-handler");

const {
  initializeDepartmentPayment,
  verifyPayment,
} = require("../controllers/Payment");

// Middleware for authentication
router.use(authenticate);

router.post(
  "/initialize-payment",
  checkRole(["Student"]),
  checkPermission(["make_payments"]),
  initializeDepartmentPayment
);

router.get(
  "/verify-payment",
  // checkRole(["Student"]),
  // checkPermission(["make_payments"]),
  verifyPayment
);

module.exports = router;
