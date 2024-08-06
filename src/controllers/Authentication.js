const { renewAccessToken } = require("../services/renewAccessToken");
const {
  loginProcess,
  processLogout,
  secondFactorAuth,
} = require("../services/authenticationService");

const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} = require("../errors");

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(StatusCodes.UNPROCESSABLE_ENTITY)
      .json({ message: "Please fill in all fields (email and password)" });
  }

  const result = await loginProcess({ email, password });

  if (result.tempToken) {
    res.status(StatusCodes.OK).json({
      id: result.id,
      username: result.username,
      email: result.email,
      roles: result.roles,
      permissions: result.permissions,
      tempToken: result.tempToken,
      expiresInSeconds: result.expiresInSeconds,
    });
  } else {
    res.status(StatusCodes.OK).json({
      id: result.id,
      username: result.username,
      email: result.email,
      roles: result.roles,
      permissions: result.permissions,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  }
};

const secondFactorLogin = async(req, res) => {
    const { tempToken, totp } = req.body;

    
  if (!tempToken || !totp) {
    throw new BadRequestError("Please fill in all fields (tempToken and totp)");
  }

    const result = await secondFactorAuth({ tempToken, totp });

     res.status(StatusCodes.OK).json({
       id: result.id,
       username: result.username,
       email: result.email,
       roles: result.roles,
       permissions: result.permissions,
       accessToken: result.accessToken,
       refreshToken: result.refreshToken,
     });
}

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    // Check if the refresh token is provided
    if (!refreshToken) {
      throw new BadRequestError("Refresh token is required");
    }

    // Call the renewAccessToken service
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await renewAccessToken(refreshToken);

    // Return both tokens in the response
    res
      .status(StatusCodes.OK)
      .json({ newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    // Log the error message for debugging
    console.error(error);

    // Handle specific error types
    if (error instanceof UnauthenticatedError) {
      res.status(StatusCodes.UNAUTHORIZED).json({ error: error.message });
    } else {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: error.message || "Token renewal failed" });
    }
  }
};

const logout = async (req, res) => {
  const userId = req.user.id;
  const accessToken = req.accessToken;

  try {
    await processLogout(userId, accessToken);
    res.status(StatusCodes.OK).json({ message: "Logout successful" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

module.exports = {
  login,
  logout,
  refreshToken,
  secondFactorLogin,
};
