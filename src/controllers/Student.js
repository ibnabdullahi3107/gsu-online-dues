const { StatusCodes } = require("http-status-codes");
const { Op, Sequelize } = require("sequelize");
const moment = require("moment");
const fs = require("fs");
const path = require("path");
const xlsxStreamReader = require("xlsx-stream-reader");
const bcrypt = require("bcrypt");
const csvParser = require("csv-parser");
const mimeTypes = require("mime-types");

const { NotFoundError, BadRequestError } = require("../errors");

const {
  Student,
  User,
  Role,
  Faculty,
  Department,
  sequelize,
} = require("../../models");

const generatePasswordFromPhoneAndSurname = (reg_number, surname) => {
  if (!reg_number || !surname) {
    throw new Error("Reg number and surname are required");
  }

  const last_reg = reg_number.slice(-4);
  const sanitizedSurname = surname.replace(/\s+/g, ""); // Remove any whitespace
  const password = `@${sanitizedSurname}${last_reg}`;

  return password;
};

const processRowsChunk = async (rows) => {
  await sequelize.transaction(async (transaction) => {
    for (const row of rows) {
      await processRow(row, transaction);
    }
  });
};

const processRow = async (row, transaction) => {
  const {
    reg_number,
    surname,
    firstname,
    gender,
    date_of_birth,
    address,
    state_origin,
    local_government_area,
    username,
    email,
    faculty_name,
    department_name,
  } = row;

  const parsedDateOfBirth = new Date(date_of_birth);
  if (isNaN(parsedDateOfBirth)) {
    throw new BadRequestError(`Invalid date_of_birth: ${date_of_birth}`);
  }

  const password = generatePasswordFromPhoneAndSurname(reg_number, surname);
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create(
    {
      username,
      email,
      password: hashedPassword,
    },
    { transaction }
  );

  const studentRole = await Role.findOne(
    {
      where: { role_name: "Student" },
    },
    { transaction }
  );

  if (!studentRole) {
    throw new NotFoundError("Student role not found");
  }

  await user.addRole(studentRole, { transaction });

  const faculty = await Faculty.findOne(
    {
      where: {
        faculty_name: {
          [Op.iLike]: faculty_name,
        },
      },
    },
    { transaction }
  );
  if (!faculty) {
    throw new NotFoundError(`Faculty ${faculty_name} not found`);
  }

  const department = await Department.findOne(
    {
      where: {
        department_name: {
          [Op.iLike]: department_name,
        },
        faculty_id: faculty.id,
      },
    },
    { transaction }
  );
  if (!department) {
    throw new NotFoundError(`Department ${department_name} not found for faculty ${faculty_name}`);
  }

  await Student.create(
    {
      reg_number,
      surname,
      firstname,
      gender,
      date_of_birth: new Date(date_of_birth),
      address,
      state_origin,
      local_government_area,
      user_id: user.id,
      faculty_id: faculty.id,
      department_id: department.id,
    },
    { transaction }
  );
};

const createStudent = (req, res) => {
  if (!req.file) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "No file uploaded" });
  }

  const filePath = req.file.path;
  const fileExtension = path.extname(filePath).toLowerCase();
  const fileMime = mimeTypes.lookup(filePath);

  if (fileMime !== "text/csv" || fileExtension !== ".csv") {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Unsupported file type, only CSV files are allowed" });
  }

  const rows = [];
  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on("data", (row) => {
      rows.push(row);
    })
    .on("end", async () => {
      try {
        await processRowsChunk(rows);
        return res
          .status(StatusCodes.OK)
          .json({ message: "File uploaded and processed successfully" });
      } catch (error) {
        console.error("Error:", error);
        return res
          .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: error.message || "Error processing CSV file" });
      } finally {
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) console.error("Failed to delete file:", unlinkErr);
        });
      }
    })
    .on("error", (error) => {
      console.error("Error:", error);
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) console.error("Failed to delete file:", unlinkErr);
      });
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Error processing CSV file" });
    });
};

const getAllStudents = async (req, res) => {
  const { status, sort, faculty_name, department_name } = req.query;

  const queryObject = {};

  if (status && status !== "all") {
    queryObject.is_active = status === "active";
  }

  try {
    if (faculty_name) {
      const faculty = await Faculty.findOne({
        where: {
          faculty_name: {
            [Op.iLike]: faculty_name,
          },
        },
      });
      if (faculty) {
        queryObject.faculty_id = faculty.id;
      } else {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: "Faculty not found" });
      }
    }

    if (department_name) {
      const department = await Department.findOne({
        where: {
          department_name: {
            [Op.iLike]: department_name,
          },
        },
      });
      if (department) {
        queryObject.department_id = department.id;
      } else {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: "Department not found" });
      }
    }

    let students = await Student.findAll({
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
        { model: Faculty, as: "faculty" },
        { model: Department, as: "department" },
      ],
      order: [], // Add your order conditions here based on 'sort' parameter
    });

    // Apply sorting based on the 'sort' query parameter
    if (sort === "latest") {
      students = students.sort((a, b) => b.createdAt - a.createdAt);
    } else if (sort === "oldest") {
      students = students.sort((a, b) => a.createdAt - b.createdAt);
    } else if (sort === "a-z") {
      students = students.sort((a, b) => a.surname.localeCompare(b.surname));
    } else if (sort === "z-a") {
      students = students.sort((a, b) => b.surname.localeCompare(a.surname));
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Apply pagination
    students = students.slice(offset, offset + limit);

    // Fetch the total count for pagination
    const totalStudents = await Student.count({ where: queryObject });
    const numOfPages = Math.ceil(totalStudents / limit);

    res.status(StatusCodes.OK).json({ students, totalStudents, numOfPages });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message || "Error fetching students" });
  }
};

module.exports = {
  createStudent,
  getAllStudents,
};
