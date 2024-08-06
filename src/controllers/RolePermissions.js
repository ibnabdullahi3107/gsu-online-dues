const { StatusCodes } = require("http-status-codes");
const { RolePermission, Role, Permission } = require("../../models");
const { NotFoundError, BadRequestError } = require("../errors");

const createRolePermission = async (req, res) => {
  const { role_id, permission_id } = req.body;

  // Use Sequelize's create method to insert a new record
  const newRolePermission = await RolePermission.create({
    role_id,
    permission_id,
  });

  // Send a success response with the created RolePermission
  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "RolePermission created successfully",
    rolePermission: newRolePermission,
  });
};

const getAllRolePermissions = async (req, res) => {
  console.log("got a function");
  const rolePermissions = await RolePermission.findAll({
    include: [
      { model: Role, as: "roles" },
      { model: Permission, as: "permissions" },
    ],
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: "All RolePermissions retrieved successfully",
    rolePermissions,
  });
};

const getRolePermission = async (req, res) => {
  // Extract the RolePermission ID from the request parameters
  const rolePermissionId = req.params.id;

  // Find the RolePermission by its ID
  const rolePermission = await RolePermission.findByPk(rolePermissionId, {
    include: [
      // Include the associated Role
      { model: Role, attributes: ["id", "role_name"] },
      // Include the associated Permission
      { model: Permission, attributes: ["id", "permission_name"] },
    ],
  });
  // Check if the RolePermission exists
  if (!rolePermission) {
    throw new NotFoundError(`RolePermission ID ${rolePermissionId} not found`);
  }

  // Send a success response with the retrieved RolePermission
  res.status(StatusCodes.OK).json({
    success: true,
    message: "RolePermission retrieved successfully",
    rolePermission,
  });
};

const updateRolePermission = async (req, res) => {
  const { id } = req.params;
  const { role_id, permission_id } = req.body;

  const rolePermission = await RolePermission.findByPk(id);

  if (!rolePermission) {
    throw new NotFoundError(`RolePermission ID ${id} not found`);
  }

  rolePermission.role_id =
    role_id !== undefined ? role_id : rolePermission.role_id;
  rolePermission.permission_id =
    permission_id !== undefined ? permission_id : rolePermission.permission_id;
  await rolePermission.save();

  res.status(StatusCodes.OK).json({
    success: true,
    message: `RolePermission ID ${id} updated successfully`,
    rolePermission,
  });
};

const deleteRolePermission = async (req, res) => {
  const { id } = req.params;

  // Check if a RolePermission with the provided ID exists in the database
  const rolePermission = await RolePermission.findByPk(id);
  if (!rolePermission) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: `RolePermission id ${id} not found`,
    });
  }

  // Delete the RolePermission
  await rolePermission.destroy();

  // Send a success response
  res.status(StatusCodes.OK).json({
    success: true,
    message: `RolePermission id ${id} deleted successfully`,
  });
};

module.exports = {
  createRolePermission,
  getAllRolePermissions,
  getRolePermission,
  updateRolePermission,
  deleteRolePermission,
};
