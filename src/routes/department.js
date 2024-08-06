const express = require("express");
const router = express.Router();

const {
  createDepartment,
  deleteDepartment,
  getAllDepartments,
  updateDepartment,
  getDepartment,
} = require("../controllers/Department");

router.route("/").post(createDepartment).get(getAllDepartments);

router
  .route("/:id")
  .get(getDepartment)
  .patch(updateDepartment)
  .delete(deleteDepartment);

module.exports = router;
