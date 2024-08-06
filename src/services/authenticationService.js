const {
  User,
  Role,
  sequelize,
  UserRole,
  Permission,
  RolePermission,
  RefreshToken,
  InvalidToken,
} = require("../../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const NodeCache = require("node-cache");
const {
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
} = require("../errors");
const dotenv = require("dotenv");
const { authenticator } = require("otplib");
const qrcode = require("qrcode");
dotenv.config();

const cache = new NodeCache();

const loginProcess = async ({ email, password }) => {
  let transaction;
  try {
    // Start a transaction
    transaction = await sequelize.transaction();

    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: Role,
          as: "roles", // Use the alias specified in the association
          through: { model: UserRole },
          include: [
            {
              model: Permission,
              as: "permissions", // Use the alias specified in the association
              through: { model: RolePermission },
            },
          ],
        },
      ],
      transaction, // Pass the transaction to ensure all queries are part of the same transaction
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthenticatedError("Invalid email or password.");
    }

    const roles = user.roles.map((role) => role.role_name);
    const permissions = user.roles.reduce((acc, role) => {
      role.permissions.forEach((permission) => {
        if (!acc.includes(permission.permission_name)) {
          acc.push(permission.permission_name);
        }
      });
      return acc;
    }, []);

    const basicUserInfo = {
      id: user.id,
      username: user.username,
      email: user.email,
      roles,
      permissions,
    };

    if (user["2faEnable"]) {
      const tempToken = crypto.randomUUID();

      cache.set(
        process.env.CACHE_TEMPORARY_TOKEN_PREFIX + tempToken,
        user.id,
        process.env.CACHE_TEMPORARY_TOKEN_EXPIRES_IN_SECONDS
      );

      return {
        ...basicUserInfo,
        tempToken,
        expiresInSeconds: process.env.CACHE_TEMPORARY_TOKEN_EXPIRES_IN_SECONDS,
      };
    } else {
      const accessToken = jwt.sign(
        { id: user.id, roles, permissions },
        process.env.JWT_ACCESS_SECRET,
        {
          subject: "accessAPI",
          expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE_IN,
        }
      );

      const refreshToken = jwt.sign(
        { id: user.id },
        process.env.JWT_REFRESH_SECRET,
        {
          subject: "refreshAPI",
          expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRE_IN,
        }
      );

      // Create a new refresh token within the transaction
      await RefreshToken.create(
        { token: refreshToken, user_id: user.id },
        { transaction }
      );

      // Commit the transaction
      await transaction.commit();

      return {
        ...basicUserInfo,
        accessToken,
        refreshToken,
      };
    }
  } catch (error) {
    // Rollback the transaction if an error occurs
    if (transaction) await transaction.rollback();
    throw error;
  }
};

const secondFactorAuth = async ({tempToken, totp}) => {

  const user_id = cache.get(
    process.env.CACHE_TEMPORARY_TOKEN_PREFIX + tempToken
  );

  if (!user_id) {
    throw new UnauthenticatedError(
      "The Provided Temporary Token Incorrect or Expired"
    );
  }

  const user = await User.findOne({
      where: { id: user_id },
      include: [
        {
          model: Role,
          as: "roles",
          through: { model: UserRole },
          include: [
            {
              model: Permission,
              as: "permissions",
              through: { model: RolePermission },
            },
          ],
        },
      ],
    });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const verified = authenticator.check(totp, user["2faSecret"]);

  if (!verified) {
    throw new BadRequestError("The Provided TOTP is Incorrect or Expired");
  }

    const roles = user.roles.map((role) => role.role_name);
    const permissions = user.roles.reduce((acc, role) => {
      role.permissions.forEach((permission) => {
        if (!acc.includes(permission.permission_name)) {
          acc.push(permission.permission_name);
        }
      });
      return acc;
    }, []);

  const accessToken = jwt.sign(
    { id: user.id, roles, permissions },
    process.env.JWT_ACCESS_SECRET,
    {
      subject: "accessAPI",
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE_IN,
    }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    {
      subject: "refreshAPI",
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRE_IN,
    }
  );

  // Create a new refresh token
  await RefreshToken.create({ token: refreshToken, user_id: user.id });

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    roles,
    permissions,
    accessToken,
    refreshToken,
  };
};

const processLogout = async (userId, accessToken) => {
  let transaction;
  try {
    // Start a transaction
    transaction = await sequelize.transaction();

    // Find the refresh token associated with the user within the transaction
    const refreshToken = await RefreshToken.findOne({
      where: { user_id: userId },
      transaction,
    });

    if (!refreshToken) {
      throw new NotFoundError("Refresh token not found");
    }

    // Invalidate the refresh token by deleting it
    await refreshToken.destroy({ transaction });

    // Create an InvalidToken record within the transaction
    await InvalidToken.create(
      {
        token: accessToken.value,
        user_id: userId,
        expiration_time: accessToken.exp,
      },
      { transaction }
    );

    // Commit the transaction
    await transaction.commit();
  } catch (error) {
    // Rollback the transaction if an error occurs
    if (transaction) await transaction.rollback();
    throw error;
  }
};

const QRCodeProcess = async (req, res) => {
  const user = await User.findOne({ where: { id: req.user.id } });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const secret = authenticator.generateSecret();
  const uri = authenticator.keyuri(user.email, "HumSad Global Concept", secret);

  await User.update({ "2faSecret": secret }, { where: { id: req.user.id } });

  const qrCode = await qrcode.toBuffer(uri, { type: "image/png", margin: 1 });

  res.setHeader("Content-Disposition", "attachment; filename=qrcode.png");

  return res.status(200).type("image/png").send(qrCode);
};

const validateQrCode = async (req, res) => {
  const { totp } = req.body;
  if (!totp) {
    throw new NotFoundError("TOTP is required");
  }

  const user = await User.findOne({ where: { id: req.user.id } });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const verified = authenticator.check(totp, user["2faSecret"]);

  if (!verified) {
    throw new BadRequestError("TOTP is not correct or has expired");
  }

  await User.update({ "2faEnable": true }, { where: { id: req.user.id } });

  return res.status(200).json({ message: "TOTP validated successfully" });
};

module.exports = {
  loginProcess,
  processLogout,
  QRCodeProcess,
  validateQrCode,
  secondFactorAuth,
};
