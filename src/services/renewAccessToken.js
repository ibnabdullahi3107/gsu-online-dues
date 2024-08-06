const { User, RefreshToken, sequelize } = require("../../models");
const jwt = require("jsonwebtoken");
const { NotFoundError } = require("../errors");
const dotenv = require("dotenv");

dotenv.config();

const renewAccessToken = async (refreshToken) => {
  let transaction;

  try {
    // Start a transaction
    transaction = await sequelize.transaction();

    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user_id = decoded.id;

    // Find the user in the database
    const user = await User.findByPk(user_id, { transaction });

    // Check if the user exists
    if (!user) {
      throw new NotFoundError("User not found");
    }

    // Find the refresh token in the database
    const storedRefreshToken = await RefreshToken.findOne({
      where: { token: refreshToken, user_id: user_id },
      transaction,
    });

    // Check if the refresh token matches the stored one
    if (!storedRefreshToken) {
      throw new NotFoundError("Refresh token not found");
    }

    // Remove the old refresh token from the database
    await storedRefreshToken.destroy({ transaction });

    // Generate a new access token
    const accessToken = jwt.sign(
      { id: user.id, roles: user.roles, permissions: user.permissions },
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE_IN,
        subject: "accessAPI",
      } // Set expiry time as needed
    );

    // Generate a new refresh token
    const newRefreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRE_IN,
        subject: "refreshAPI",
      }
    );

    // Store the new refresh token in the database
    await RefreshToken.create(
      { token: newRefreshToken, user_id: user.id },
      { transaction }
    );

    // Commit the transaction
    await transaction.commit();

    // Return the new access token and refresh token
    return { accessToken, refreshToken: newRefreshToken };
  } catch (error) {
    console.error(error); // Log the error to the console

    // Rollback the transaction if an error occurs
    if (transaction) await transaction.rollback();
    throw error;
  }
};

module.exports = {
  renewAccessToken,
};
