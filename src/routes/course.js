const express = require("express");
const router = express.Router();

const {
  createCourse,
  getAllCourses,
  getCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/Course");

router.route("/").post(createCourse).get(getAllCourses);

router.route("/:id").get(getCourse).patch(updateCourse).delete(deleteCourse);

module.exports = router;
