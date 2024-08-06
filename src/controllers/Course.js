const { StatusCodes } = require("http-status-codes");
const { Course, Department, Faculty } = require("../../models");
const { BadRequestError, NotFoundError } = require("../errors");

const createCourse = async (req, res) => {
  const { department_id, course_name } = req.body;

  // Use Sequelize's create method to insert a new record
  const newCourse = await Course.create({
    department_id,
    course_name,
  });

  // Send a success response with the created Course
  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Course created successfully",
    course: newCourse,
  });
};

const getAllCourses = async (req, res) => {
  const { status, sort } = req.query;

  const queryObject = {};

  if (status && status !== "all") {
    queryObject.is_active = status === "active";
  }

  let courses = await Course.findAll({
    where: queryObject,
    include: [{ model: Department, as: "department"}],
    order: [], // Add your order conditions here based on 'sort' parameter
  });

  // Apply sorting based on the 'sort' query parameter
  if (sort === "latest") {
    courses = courses.sort((a, b) => b.createdAt - a.createdAt);
  } else if (sort === "oldest") {
    courses = courses.sort((a, b) => a.createdAt - b.createdAt);
  } else if (sort === "a-z") {
    courses = courses.sort((a, b) =>
      a.course_name.localeCompare(b.course_name)
    );
  } else if (sort === "z-a") {
    courses = courses.sort((a, b) =>
      b.course_name.localeCompare(a.course_name)
    );
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  // Apply pagination
  courses = courses.slice(offset, offset + limit);

  // Fetch the total count for pagination
  const totalCourses = await Course.count({ where: queryObject });
  const numOfPages = Math.ceil(totalCourses / limit);

  res.status(StatusCodes.OK).json({ courses, totalCourses, numOfPages });
};

const getCourse = async (req, res) => {
  const courseId = req.params.id;

  // Find the Course by its ID
  const course = await Course.findByPk(courseId, {
    include: [{ model: Department, as: "department" }],
  });

  // Check if the Course exists
  if (!course) {
    throw new NotFoundError(`Course ID ${courseId} not found`);
  }

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Course retrieved successfully",
    course,
  });
};

const updateCourse = async (req, res) => {
  const { id } = req.params;

  // Check if a Course with the provided ID exists in the database
  const existingCourse = await Course.findByPk(id);

  // Extract the updated Course details from the request body
  const { department_id, course_name } = req.body;

  if (course_name === "") {
    throw new BadRequestError("Course fields cannot be empty");
  }

  // Use Sequelize's update method to update the Course record in the database
  await existingCourse.update({
    department_id,
    course_name,
  });

  if (!existingCourse) {
    throw new NotFoundError(`Course ID ${id} not found`);
  }

  res.status(StatusCodes.OK).json({
    success: true,
    message: `Course id ${id} updated successfully`,
    course: existingCourse,
  });
};

const deleteCourse = async (req, res) => {
  const { id } = req.params;

  // Check if a Course with the provided ID exists in the database
  const course = await Course.findByPk(id);
  if (!course) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: `Course id ${id} not found`,
    });
  }

  await course.destroy();

  res.status(StatusCodes.OK).json({
    success: true,
    message: `Course id ${id} deleted successfully`,
  });
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourse,
  updateCourse,
  deleteCourse,
};
