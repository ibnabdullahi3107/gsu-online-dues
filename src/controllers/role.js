const { StatusCodes } = require("http-status-codes");
// const moment = require("moment");
const { Role } = require("../../models");
// const { Op } = require("sequelize");
const yup = require("yup");

const { BadRequestError, NotFoundError } = require("../errors");

const createRole = async (req, res) => {
  const { role_name } = req.body;

  // Use Sequelize's create method to insert a new record
  const newRole = await Role.create({
    role_name,
  });

  // Send a success response with the created Role
  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Role created successfully",
    Role: newRole,
  });
};

const getAllRoles = async (req, res) => {

  const { status, sort } = req.query;

  const queryObject = {};

  // Check if req.user is defined before accessing its properties
  if (req.user && req.user.userId) {
    queryObject.createdBy = req.user.userId;
  }

  if (status && status !== "all") {
    queryObject.status = status;
  }

  // Modify your logic to fetch Roles based on validated query parameters
  let Roles = await Role.findAll({
    where: queryObject,
    order: [], // Add your order conditions here based on 'sort' parameter
    offset: 0, // Set your offset value based on pagination
    limit: 10, // Set your limit value based on pagination
  });

  // Apply sorting based on the 'sort' query parameter
  if (sort === "latest") {
    Roles = Roles.sort((a, b) => b.createdAt - a.createdAt);
  } else if (sort === "oldest") {
    Roles = Roles.sort((a, b) => a.createdAt - b.createdAt);
  } else if (sort === "a-z") {
    Roles = Roles.sort((a, b) => a.position.localeCompare(b.position));
  } else if (sort === "z-a") {
    Roles = Roles.sort((a, b) => b.position.localeCompare(a.position));
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  // Apply pagination
  Roles = Roles.slice(offset, offset + limit);

  // Fetch the total count for pagination
  const totalRoles = await Role.count({ where: queryObject });
  const numOfPages = Math.ceil(totalRoles / limit);

  res.status(StatusCodes.OK).json({ Roles, totalRoles, numOfPages });
};

const getRole = async (req, res) => {
  // Extract the Role ID from the request parameters
  const RoleId = req.params.id;

  // Find the Role by its ID
  const Role = await Role.findByPk(RoleId);

  // Check if the Role exists
  if (!Role) {
    throw new NotFoundError(`Role ID ${RoleId} not found`);
  }

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Role retrieved successfully",
    Role,
  });
};

const updateRole = async (req, res) => {
  const { id } = req.params;

  // Check if a Role with the provided ID exists in the database
  const existingRole = await Role.findByPk(id);

  // Extract the updated Role details from the request body
  const { role_name } = req.body;

  if (role_name === "") {
    throw new BadRequestError("Role fields cannot be empty");
  }

  // Use Sequelize's update method to update the Role record in the database
  await existingRole.update({
    role_name,
  });

  if (!existingRole) {
    throw new NotFoundError(`Role ID ${RoleId} not found`);
  }
  // Send a success response with the updated Role details
  res.status(StatusCodes.OK).json({
    success: true,
    message: `Role id ${id} updated successfully`,
    Role: existingRole,
  });
};

const deleteRole = async (req, res) => {
  const { id } = req.params;

  // Check if a Role with the provided ID exists in the database
  const Role = await Role.findByPk(id);
  if (!Role) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: `Role id ${id} not found`,
    });
  }

  await Role.destroy();

  // Send a success response
  res.status(StatusCodes.OK).json({
    success: true,
    message: `Role id ${id} deleted successfully`,
  });
};

module.exports = {
  createRole,
  getAllRoles,
  getRole,
  updateRole,
  deleteRole,
};
