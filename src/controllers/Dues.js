const { StatusCodes } = require("http-status-codes");
const { Due, Department, Association } = require("../../models");
const yup = require("yup");

const { BadRequestError, NotFoundError } = require("../errors");

const createDue = async (req, res) => {
  const schema = yup.object().shape({
    due_name: yup.string().min(3).max(100).required(),
    amount: yup.number().required(),
    due_type: yup.mixed().oneOf(["Department", "Association"]).required(),
    reference_id: yup.number().required(),
  });

  await schema.validate(req.body);

  const { due_name, amount, due_type, reference_id } = req.body;

  // Validate due_type and reference_id
  if (due_type !== "Department" && due_type !== "Association") {
    throw new BadRequestError(`Invalid payable type: ${due_type}`);
  }

  const payableModel = due_type === "Department" ? Department : Association;
  const payableEntity = await payableModel.findByPk(reference_id);

  if (!payableEntity) {
    throw new NotFoundError(`No ${due_type} with id ${reference_id}`);
  }

  const newDue = await Due.create({
    due_name: due_name.toUpperCase(),
    amount,
    due_type: due_type,
    reference_id: reference_id,
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Due created successfully",
    due: newDue,
  });
};

const getAllDues = async (req, res) => {
  const { status, sort } = req.query;

  const queryObject = {};

  if (req.user && req.user.userId) {
    queryObject.createdBy = req.user.userId;
  }

  if (status && status !== "all") {
    queryObject.status = status;
  }

  const dues = await Due.findAll({
    where: queryObject,
    include: [
      {
        model: Department,
        as: "department",
        required: false,
      },
      {
        model: Association,
        as: "association",
        required: false,
      },
    ],
    order: [], // Add your order conditions here based on 'sort' parameter
    offset: 0, // Set your offset value based on pagination
    limit: 10, // Set your limit value based on pagination
  });

  // Filter associations based on due_type
  const filteredDues = dues.map((due) => {
    const dueJson = due.toJSON();
    if (due.due_type === "Department") {
      delete dueJson.association;
    } else if (due.due_type === "Association") {
      delete dueJson.department;
    }
    return dueJson;
  });

  if (sort === "latest") {
    filteredDues.sort((a, b) => b.createdAt - a.createdAt);
  } else if (sort === "oldest") {
    filteredDues.sort((a, b) => a.createdAt - b.createdAt);
  } else if (sort === "a-z") {
    filteredDues.sort((a, b) => a.due_name.localeCompare(b.due_name));
  } else if (sort === "z-a") {
    filteredDues.sort((a, b) => b.due_name.localeCompare(a.due_name));
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const paginatedDues = filteredDues.slice(offset, offset + limit);

  const totalDues = await Due.count({ where: queryObject });
  const numOfPages = Math.ceil(totalDues / limit);

  res
    .status(StatusCodes.OK)
    .json({ dues: paginatedDues, totalDues, numOfPages });
};

const getDue = async (req, res) => {
  const dueId = req.params.id;

  const due = await Due.findByPk(dueId);

  if (!due) {
    throw new NotFoundError(`Due ID ${dueId} not found`);
  }

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Due retrieved successfully",
    due,
  });
};

const updateDue = async (req, res) => {
  const { id } = req.params;

  const existingDue = await Due.findByPk(id);

  if (!existingDue) {
    throw new NotFoundError(`Due ID ${id} not found`);
  }

  const { due_name, amount, due_type, reference_id } = req.body;

  if (!due_name || !amount || !due_type || !reference_id) {
    throw new BadRequestError("All fields must be provided");
  }

  // Validate due_type and reference_id
  if (due_type !== "Department" && due_type !== "Association") {
    throw new BadRequestError(`Invalid payable type: ${due_type}`);
  }

  const payableModel = due_type === "Department" ? Department : Association;
  const payableEntity = await payableModel.findByPk(reference_id);

  if (!payableEntity) {
    throw new NotFoundError(`No ${due_type} with id ${reference_id}`);
  }

  await existingDue.update({
    due_name: due_name.toUpperCase(),
    amount,
    due_type: due_type,
    reference_id: reference_id,
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: `Due id ${id} updated successfully`,
    due: existingDue,
  });
};

const deleteDue = async (req, res) => {
  const { id } = req.params;

  const due = await Due.findByPk(id);
  if (!due) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: `Due id ${id} not found`,
    });
  }

  await due.destroy();

  res.status(StatusCodes.OK).json({
    success: true,
    message: `Due id ${id} deleted successfully`,
  });
};

module.exports = {
  createDue,
  getAllDues,
  getDue,
  updateDue,
  deleteDue,
};
