const express = require("express");
const router = express.Router();

const {
  createRole,
  deleteRole,
  getAllRoles,
  updateRole,
  getRole,
} = require("../controllers/Role");

router.route("/").post(createRole).get(getAllRoles);

router.route("/:id").get(getRole).patch(updateRole).delete(deleteRole);

module.exports = router;
