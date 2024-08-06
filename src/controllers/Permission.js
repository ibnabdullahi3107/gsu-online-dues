const { StatusCodes } = require("http-status-codes");
// const moment = require("moment");
const { Permission } = require("../../models");
// const { Op } = require("sequelize");
const yup = require("yup");

const { BadRequestError, NotFoundError } = require("../errors");

const createPermission = async (req, res) => {
  const { permission_name } = req.body;

  // Use Sequelize's create method to insert a new record
  const newPermission = await Permission.create({
    permission_name,
  });

  // Send a success response with the created Permission
  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Permission created successfully",
    Permission: newPermission,
  });
};

const getAllPermissions = async (req, res) => {
  const { status, sort } = req.query;

  const queryObject = {};

  // Check if req.user is defined before accessing its properties
  if (req.user && req.user.userId) {
    queryObject.createdBy = req.user.userId;
  }

  if (status && status !== "all") {
    queryObject.status = status;
  }

  // Modify your logic to fetch Permissions based on validated query parameters
  let Permissions = await Permission.findAll({
    where: queryObject,
    order: [], // Add your order conditions here based on 'sort' parameter
    offset: 0, // Set your offset value based on pagination
    limit: 10, // Set your limit value based on pagination
  });

  // Apply sorting based on the 'sort' query parameter
  if (sort === "latest") {
    Permissions = Permissions.sort((a, b) => b.createdAt - a.createdAt);
  } else if (sort === "oldest") {
    Permissions = Permissions.sort((a, b) => a.createdAt - b.createdAt);
  } else if (sort === "a-z") {
    Permissions = Permissions.sort((a, b) => a.position.localeCompare(b.position));
  } else if (sort === "z-a") {
    Permissions = Permissions.sort((a, b) => b.position.localeCompare(a.position));
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  // Apply pagination
  Permissions = Permissions.slice(offset, offset + limit);

  // Fetch the total count for pagination
  const totalPermissions = await Permission.count({ where: queryObject });
  const numOfPages = Math.ceil(totalPermissions / limit);

  res.status(StatusCodes.OK).json({ Permissions, totalPermissions, numOfPages });
};

const getPermission = async (req, res) => {
  // Extract the Permission ID from the request parameters
  const PermissionId = req.params.id;

  // Find the Permission by its ID
  const Permission = await Permission.findByPk(PermissionId);

  // Check if the Permission exists
  if (!Permission) {
    throw new NotFoundError(`Permission ID ${PermissionId} not found`);
  }

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Permission retrieved successfully",
    Permission,
  });
};

const updatePermission = async (req, res) => {
  const { id } = req.params;

  // Check if a Permission with the provided ID exists in the database
  const existingPermission = await Permission.findByPk(id);

  // Extract the updated Permission details from the request body
  const { permission_name } = req.body;

  if (permission_name === "") {
    throw new BadRequestError("Permission fields cannot be empty");
  }

  // Use Sequelize's update method to update the Permission record in the database
  await existingPermission.update({
    permission_name,
  });

  if (!existingPermission) {
    throw new NotFoundError(`Permission ID ${PermissionId} not found`);
  }
  // Send a success response with the updated Permission details
  res.status(StatusCodes.OK).json({
    success: true,
    message: `Permission id ${id} updated successfully`,
    Permission: existingPermission,
  });
};

const deletePermission = async (req, res) => {
  const { id } = req.params;

  // Check if a Permission with the provided ID exists in the database
  const Permission = await Permission.findByPk(id);
  if (!Permission) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: `Permission id ${id} not found`,
    });
  }

  await Permission.destroy();

  // Send a success response
  res.status(StatusCodes.OK).json({
    success: true,
    message: `Permission id ${id} deleted successfully`,
  });
};

module.exports = {
  createPermission,
  getAllPermissions,
  getPermission,
  updatePermission,
  deletePermission,
};
