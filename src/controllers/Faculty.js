const { StatusCodes } = require("http-status-codes");
// const moment = require("moment");
const { Faculty } = require("../../models");
// const { Op } = require("sequelize");
const yup = require("yup");

const { BadRequestError, NotFoundError } = require("../errors");

const createFaculty = async (req, res) => {
  let { faculty_name } = req.body;

  faculty_name = faculty_name.toUpperCase();

  // Use Sequelize's create method to insert a new record
  const newFaculty = await Faculty.create({
    faculty_name,
  });

  // Send a success response with the created Faculty
  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Faculty created successfully",
    Faculty: newFaculty,
  });
};

const getAllFaculties = async (req, res) => {
  const { status, sort } = req.query;

  const queryObject = {};

  // Check if req.user is defined before accessing its properties
  if (req.user && req.user.userId) {
    queryObject.createdBy = req.user.userId;
  }

  if (status && status !== "all") {
    queryObject.status = status;
  }

  // Modify your logic to fetch Faculties based on validated query parameters
  let Faculties = await Faculty.findAll({
    where: queryObject,
    order: [], // Add your order conditions here based on 'sort' parameter
    offset: 0, // Set your offset value based on pagination
    limit: 10, // Set your limit value based on pagination
  });

  // Apply sorting based on the 'sort' query parameter
  if (sort === "latest") {
    Faculties = Faculties.sort((a, b) => b.createdAt - a.createdAt);
  } else if (sort === "oldest") {
    Faculties = Faculties.sort((a, b) => a.createdAt - b.createdAt);
  } else if (sort === "a-z") {
    Faculties = Faculties.sort((a, b) =>
      a.position.localeCompare(b.position)
    );
  } else if (sort === "z-a") {
    Faculties = Faculties.sort((a, b) =>
      b.position.localeCompare(a.position)
    );
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  // Apply pagination
  Faculties = Faculties.slice(offset, offset + limit);

  // Fetch the total count for pagination
  const totalFaculties = await Faculty.count({ where: queryObject });
  const numOfPages = Math.ceil(totalFaculties / limit);

  res
    .status(StatusCodes.OK)
    .json({ Faculties, totalFaculties, numOfPages });
};

const getFaculty = async (req, res) => {
  // Extract the Faculty ID from the request parameters
  const FacultyId = req.params.id;

  // Find the Faculty by its ID
  const Faculty = await Faculty.findByPk(FacultyId);

  // Check if the Faculty exists
  if (!Faculty) {
    throw new NotFoundError(`Faculty ID ${FacultyId} not found`);
  }

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Faculty retrieved successfully",
    Faculty,
  });
};

const updateFaculty = async (req, res) => {
  const { id } = req.params;

  // Check if a Faculty with the provided ID exists in the database
  const existingFaculty = await Faculty.findByPk(id);

  // Extract the updated Faculty details from the request body
  const { faculty_name } = req.body;

  if (faculty_name === "") {
    throw new BadRequestError("Faculty fields cannot be empty");
  }

  // Use Sequelize's update method to update the Faculty record in the database
  await existingFaculty.update({
    faculty_name,
  });

  if (!existingFaculty) {
    throw new NotFoundError(`Faculty ID ${FacultyId} not found`);
  }
  // Send a success response with the updated Faculty details
  res.status(StatusCodes.OK).json({
    success: true,
    message: `Faculty id ${id} updated successfully`,
    Faculty: existingFaculty,
  });
};

const deleteFaculty = async (req, res) => {
  const { id } = req.params;

  // Check if a Faculty with the provided ID exists in the database
  const Faculty = await Faculty.findByPk(id);
  if (!Faculty) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: `Faculty id ${id} not found`,
    });
  }

  await Faculty.destroy();

  // Send a success response
  res.status(StatusCodes.OK).json({
    success: true,
    message: `Faculty id ${id} deleted successfully`,
  });
};

module.exports = {
  createFaculty,
  getAllFaculties,
  getFaculty,
  updateFaculty,
  deleteFaculty,
};
