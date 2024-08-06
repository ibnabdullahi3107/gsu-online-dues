// controllers/staffController.js
const { StatusCodes } = require("http-status-codes");
const { Op, Sequelize } = require("sequelize");
const bcrypt = require("bcrypt");
const { NotFoundError, BadRequestError } = require("../errors");
const { Staff, User, Role, sequelize } = require("../../models");

const generatePassword = (phone_number, surname) => {
  if (!phone_number || !surname) {
    throw new Error("PSN number and surname are required");
  }

  const last_phone_number = phone_number.slice(-4);
  const sanitizedSurname = surname.replace(/\s+/g, ""); // Remove any whitespace
  const password = `@${sanitizedSurname}${last_phone_number}`;

  return password;
};

const createStaff = async (req, res) => {
  const {
    psn_number,
    surname,
    firstname,
    username,
    role_id,
    email,
    gender,
    date_of_birth,
    phone_number,
    address,
    state_origin,
    local_government_area,
  } = req.body;

  // Validate required fields
  if (
    !psn_number ||
    !surname ||
    !firstname ||
    !username ||
    !role_id ||
    !gender ||
    !date_of_birth ||
    !phone_number ||
    !address ||
    !state_origin ||
    !local_government_area ||
    !email
  ) {
   throw new BadRequestError("All fields are required");
  }

  try {
    const parsedDateOfBirth = new Date(date_of_birth);
    if (isNaN(parsedDateOfBirth)) {
      throw new BadRequestError(`Invalid date_of_birth: ${date_of_birth}`);
    }

    const password = generatePassword(phone_number, surname);
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await sequelize.transaction(async (transaction) => {
      const newUser = await User.create(
        {
          username,
          email,
          password: hashedPassword,
        },
        { transaction }
      );

      const role = await Role.findByPk(role_id, { transaction });

      if (!role) {
        throw new NotFoundError("Role not found");
      }

      await newUser.addRole(role, { transaction });

      await Staff.create(
        {
          psn_number,
          surname,
          firstname,
          gender,
          date_of_birth: parsedDateOfBirth,
          phone_number,
          address,
          state_origin,
          local_government_area,
          user_id: newUser.id,
        },
        { transaction }
      );

      return newUser;
    });

    res
      .status(StatusCodes.CREATED)
      .json({ user, message: "Staff created successfully" });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message || "Error creating staff" });
  }
};

const getAllStaffs = async (req, res) => {
  const { status, sort } = req.query;

  const queryObject = {};

  if (status && status !== "all") {
    queryObject.is_active = status === "active";
  }

  try {
    let staffs = await Staff.findAll({
      where: queryObject,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["username", "email"],
          include: [
            {
              model: Role,
              as: "roles",
              attributes: ["role_name"],
              through: {
                attributes: [], // Exclude join table attributes
              },
            },
          ],
        },
      ],
      order: [],
    });

    // Apply sorting based on the 'sort' query parameter
    if (sort === "latest") {
      staffs = staffs.sort((a, b) => b.createdAt - a.createdAt);
    } else if (sort === "oldest") {
      staffs = staffs.sort((a, b) => a.createdAt - b.createdAt);
    } else if (sort === "a-z") {
      staffs = staffs.sort((a, b) => a.surname.localeCompare(b.surname));
    } else if (sort === "z-a") {
      staffs = staffs.sort((a, b) => b.surname.localeCompare(a.surname));
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Apply pagination
    staffs = staffs.slice(offset, offset + limit);

    // Fetch the total count for pagination
    const totalStaffs = await Staff.count({ where: queryObject });
    const numOfPages = Math.ceil(totalStaffs / limit);

    res.status(StatusCodes.OK).json({ staffs, totalStaffs, numOfPages });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message || "Error fetching staffs" });
  }
};

module.exports = {
  createStaff,
  getAllStaffs,
};
