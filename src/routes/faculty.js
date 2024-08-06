const express = require("express");
const router = express.Router();

const {
  createFaculty,
  deleteFaculty,
  getAllFaculties,
  updateFaculty,
  getFaculty,
} = require("../controllers/Faculty");

router.route("/").post(createFaculty).get(getAllFaculties);

router.route("/:id").get(getFaculty).patch(updateFaculty).delete(deleteFaculty);

module.exports = router;
