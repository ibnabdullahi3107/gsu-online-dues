const express = require("express");
const router = express.Router();

const {
  createDue,
  getAllDues,
  getDue,
  updateDue,
  deleteDue,
} = require("../controllers/Dues");

router.route("/").post(createDue).get(getAllDues);

router
  .route("/:id")
  .get(getDue)
  .patch(updateDue)
  .delete(deleteDue);

module.exports = router;
