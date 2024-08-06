const { StatusCodes } = require("http-status-codes");
const { Faculty, Department } = require("../../models");
const { BadRequestError, NotFoundError } = require("../errors");
const { Op } = require("sequelize");
const FlutterwaveService = require("../services/flutterwaveService");

const createDepartment = async (req, res) => {
  let {
    faculty_id,
    department_name,
    account_number,
    head_first_name,
    head_last_name,
    head_phone,
    email,
  } = req.body;

  if (
    !faculty_id ||
    !department_name ||
    !account_number ||
    !head_first_name ||
    !head_last_name ||
    !head_phone ||
    !email
  ) {
    throw new BadRequestError("All fields are required");
  }

  const faculty = await Faculty.findByPk(faculty_id);

  if (!faculty) {
    throw new NotFoundError(`No Faculty with id ${faculty_id}`);
  }

  department_name = department_name.toUpperCase();

  const subaccountData = {
    account_bank: "044",
    account_number: account_number,
    business_name: department_name,
    business_email: email,
    business_contact: `${head_first_name} ${head_last_name}`,
    business_contact_mobile: head_phone,
    business_mobile: head_phone,
    country: "NG",
    meta: [{ meta_name: "mem_adr", meta_value: "0x16241F327213" }],
    split_type: "percentage",
    split_value: 0.1,
  };

  try {
    const subaccountResponse = await FlutterwaveService.createSubaccount(
      subaccountData
    );

    // Use Sequelize's create method to insert a new record
    const newDepartment = await Department.create({
      faculty_id,
      department_name,
      head_first_name,
      head_last_name,
      head_phone,
      email,
      flutterwave_subaccount_id: subaccountResponse.data.id,
      flutterwave_subaccount_bank: subaccountResponse.data.account_bank,
      flutterwave_subaccount_account_number:
        subaccountResponse.data.account_number,
    });

    // Send a success response with the created Department
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Department created successfully",
      department: newDepartment,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllDepartments = async (req, res) => {
  const { status, sort, department_name } = req.query;

  const queryObject = {};

  if (status && status !== "all") {
    queryObject.is_active = status === "active";
  }

  if (department_name) {
    queryObject.department_name = {
      [Op.iLike]: `%${department_name}%`,
    };
  }

  let departments = await Department.findAll({
    where: queryObject,
    include: [{ model: Faculty, as: "faculty" }],
  });

  // Apply sorting based on the 'sort' query parameter
  if (sort === "latest") {
    departments = departments.sort((a, b) => b.createdAt - a.createdAt);
  } else if (sort === "oldest") {
    departments = departments.sort((a, b) => a.createdAt - b.createdAt);
  } else if (sort === "a-z") {
    departments = departments.sort((a, b) =>
      a.department_name.localeCompare(b.department_name)
    );
  } else if (sort === "z-a") {
    departments = departments.sort((a, b) =>
      b.department_name.localeCompare(a.department_name)
    );
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  // Apply pagination
  departments = departments.slice(offset, offset + limit);

  // Fetch the total count for pagination
  const totalDepartments = await Department.count({ where: queryObject });
  const numOfPages = Math.ceil(totalDepartments / limit);

  res
    .status(StatusCodes.OK)
    .json({ departments, totalDepartments, numOfPages });
};

const getDepartment = async (req, res) => {
  const departmentId = req.params.id;

  // Find the Department by its ID
  const department = await Department.findByPk(departmentId, {
    include: [{ model: Faculty, as: "faculty" }],
  });

  // Check if the Department exists
  if (!department) {
    throw new NotFoundError(`Department ID ${departmentId} not found`);
  }

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Department retrieved successfully",
    department,
  });
};

const updateDepartment = async (req, res) => {
  const { id } = req.params;

  // Check if a Department with the provided ID exists in the database
  const existingDepartment = await Department.findByPk(id);

  // Extract the updated Department details from the request body
  const { faculty_id, department_name, is_active } = req.body;

  if (!existingDepartment) {
    throw new NotFoundError(`Department ID ${id} not found`);
  }

  if (department_name === "") {
    throw new BadRequestError("Department fields cannot be empty");
  }

  // Use Sequelize's update method to update the Department record in the database
  await existingDepartment.update({
    faculty_id,
    department_name,
    is_active,
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: `Department id ${id} updated successfully`,
    department: existingDepartment,
  });
};

const deleteDepartment = async (req, res) => {
  const { id } = req.params;

  // Check if a Department with the provided ID exists in the database
  const department = await Department.findByPk(id);
  if (!department) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: `Department id ${id} not found`,
    });
  }

  await department.destroy();

  res.status(StatusCodes.OK).json({
    success: true,
    message: `Department id ${id} deleted successfully`,
  });
};

module.exports = {
  createDepartment,
  getAllDepartments,
  getDepartment,
  updateDepartment,
  deleteDepartment,
};
