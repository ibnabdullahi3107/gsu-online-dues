const express = require("express");
const router = express.Router();

const {
  createAssociation,
  deleteAssociation,
  getAllFaculties,
  updateAssociation,
  getAssociation,
} = require("../controllers/Association");

router.route("/").post(createAssociation).get(getAllFaculties);

router.route("/:id").get(getAssociation).patch(updateAssociation).delete(deleteAssociation);

module.exports = router;
