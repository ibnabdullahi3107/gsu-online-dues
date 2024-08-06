const { StatusCodes } = require("http-status-codes");
// const moment = require("moment");
const { Association } = require("../../models");
// const { Op } = require("sequelize");
const yup = require("yup");

const { BadRequestError, NotFoundError } = require("../errors");



const createAssociation = async (req, res) => {
  let {
    association_name,
    short_name,
    head_first_name,
    head_last_name,
    head_phone,
    email,
  } = req.body;

  if (
    !association_name ||
    !short_name ||
    !head_first_name ||
    !head_last_name ||
    !head_phone ||
    !email
  ) {
    throw new BadRequestError("All fields are required");
  }

  association_name = association_name.toUpperCase();
  short_name = short_name.toUpperCase();

  // Create a customer in Paystack
  const customerData = {
    first_name: head_first_name,
    last_name: head_last_name,
    email: email,
    phone: head_phone,
  };

  // const customerResponse = await proccessCustomer(customerData);

  // // Create a dedicated virtual account for the customer
  // const dedicatedAccountResponse = await createDedicatedAccount(
  //   customerResponse.data.customer_code
  // );

  // Use Sequelize's create method to insert a new record
  const newAssociation = await Association.create({
    association_name,
    short_name,
    head_first_name,
    head_last_name,
    head_phone,
    email,
    paystack_wallet_id: dedicatedAccountResponse.data.id,
    paystack_wallet_account_number:
      dedicatedAccountResponse.data.account_number,
    paystack_wallet_bank: dedicatedAccountResponse.data.bank.name,
  });

  // Send a success response with the created Association
  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Association created successfully",
    association: newAssociation,
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
  let Faculties = await Association.findAll({
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
    Faculties = Faculties.sort((a, b) => a.position.localeCompare(b.position));
  } else if (sort === "z-a") {
    Faculties = Faculties.sort((a, b) => b.position.localeCompare(a.position));
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  // Apply pagination
  Faculties = Faculties.slice(offset, offset + limit);

  // Fetch the total count for pagination
  const totalFaculties = await Association.count({ where: queryObject });
  const numOfPages = Math.ceil(totalFaculties / limit);

  res.status(StatusCodes.OK).json({ Faculties, totalFaculties, numOfPages });
};

const getAssociation = async (req, res) => {
  // Extract the Association ID from the request parameters
  const AssociationId = req.params.id;

  // Find the Association by its ID
  const Association = await Association.findByPk(AssociationId);

  // Check if the Association exists
  if (!Association) {
    throw new NotFoundError(`Association ID ${AssociationId} not found`);
  }

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Association retrieved successfully",
    Association,
  });
};

const updateAssociation = async (req, res) => {
  const { id } = req.params;

  // Check if a Association with the provided ID exists in the database
  const existingAssociation = await Association.findByPk(id);

  // Extract the updated Association details from the request body
  const { association_name, short_name } = req.body;

  if (association_name === "" || short_name === "") {
    throw new BadRequestError("Association fields cannot be empty");
  }

  // Use Sequelize's update method to update the Association record in the database
  await existingAssociation.update({
    association_name,
    short_name,
  });

  if (!existingAssociation) {
    throw new NotFoundError(`Association ID ${AssociationId} not found`);
  }
  // Send a success response with the updated Association details
  res.status(StatusCodes.OK).json({
    success: true,
    message: `Association id ${id} updated successfully`,
    Association: existingAssociation,
  });
};

const deleteAssociation = async (req, res) => {
  const { id } = req.params;

  // Check if a Association with the provided ID exists in the database
  const Association = await Association.findByPk(id);
  if (!Association) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: `Association id ${id} not found`,
    });
  }

  await Association.destroy();

  // Send a success response
  res.status(StatusCodes.OK).json({
    success: true,
    message: `Association id ${id} deleted successfully`,
  });
};

module.exports = {
  createAssociation,
  getAllFaculties,
  getAssociation,
  updateAssociation,
  deleteAssociation,
};
