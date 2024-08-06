const { StatusCodes } = require("http-status-codes");
// const moment = require("moment");
const { Level } = require("../../models");
// const { Op } = require("sequelize");
const yup = require("yup");

const { BadRequestError, NotFoundError } = require("../errors");

const createLevel = async (req, res) => {
  const { level_name } = req.body;

  // Use Sequelize's create method to insert a new record
  const newLevel = await Level.create({
    level_name,
  });

  // Send a success response with the created Level
  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Level created successfully",
    Level: newLevel,
  });
};

const getAllLevels = async (req, res) => {
  const { status, sort } = req.query;

  const queryObject = {};

  // Check if req.user is defined before accessing its properties
  if (req.user && req.user.userId) {
    queryObject.createdBy = req.user.userId;
  }

  if (status && status !== "all") {
    queryObject.status = status;
  }

  // Modify your logic to fetch Levels based on validated query parameters
  let Levels = await Level.findAll({
    where: queryObject,
    order: [], // Add your order conditions here based on 'sort' parameter
    offset: 0, // Set your offset value based on pagination
    limit: 10, // Set your limit value based on pagination
  });

  // Apply sorting based on the 'sort' query parameter
  if (sort === "latest") {
    Levels = Levels.sort((a, b) => b.createdAt - a.createdAt);
  } else if (sort === "oldest") {
    Levels = Levels.sort((a, b) => a.createdAt - b.createdAt);
  } else if (sort === "a-z") {
    Levels = Levels.sort((a, b) => a.position.localeCompare(b.position));
  } else if (sort === "z-a") {
    Levels = Levels.sort((a, b) => b.position.localeCompare(a.position));
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  // Apply pagination
  Levels = Levels.slice(offset, offset + limit);

  // Fetch the total count for pagination
  const totalLevels = await Level.count({ where: queryObject });
  const numOfPages = Math.ceil(totalLevels / limit);

  res.status(StatusCodes.OK).json({ Levels, totalLevels, numOfPages });
};

const getLevel = async (req, res) => {
  // Extract the Level ID from the request parameters
  const { id } = req.params;

  // Find the Level by its ID
  const level = await Level.findByPk(id);

  // Check if the Level exists
  if (!level) {
    throw new NotFoundError(`Level ID ${LevelId} not found`);
  }

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Level retrieved successfully",
    level,
  });
};

const updateLevel = async (req, res) => {
  const { id } = req.params;

  // Check if a Level with the provided ID exists in the database
  const existingLevel = await Level.findByPk(id);

  // Extract the updated Level details from the request body
  const { level_name } = req.body;

  if (level_name === "") {
    throw new BadRequestError("Level fields cannot be empty");
  }

  // Use Sequelize's update method to update the Level record in the database
  await existingLevel.update({
    level_name,
  });

  if (!existingLevel) {
    throw new NotFoundError(`Level ID ${LevelId} not found`);
  }
  // Send a success response with the updated Level details
  res.status(StatusCodes.OK).json({
    success: true,
    message: `Level id ${id} updated successfully`,
    Level: existingLevel,
  });
};

const deleteLevel = async (req, res) => {
  const { id } = req.params;

  // Check if a Level with the provided ID exists in the database
  const Level = await Level.findByPk(id);
  if (!Level) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: `Level id ${id} not found`,
    });
  }

  await Level.destroy();

  // Send a success response
  res.status(StatusCodes.OK).json({
    success: true,
    message: `Level id ${id} deleted successfully`,
  });
};

module.exports = {
  createLevel,
  getAllLevels,
  getLevel,
  updateLevel,
  deleteLevel,
};
