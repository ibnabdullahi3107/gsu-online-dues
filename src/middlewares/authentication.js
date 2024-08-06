const jwt = require("jsonwebtoken");
const { UnauthenticatedError, NotFoundError } = require("../errors");
const { User, Role, Permission, InvalidToken } = require("../../models");

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(
      new UnauthenticatedError("Authentication token missing or invalid")
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    // Check if the token is invalidated
    const invalidToken = await InvalidToken.findOne({ where: { token } });
    if (invalidToken) {
      return next(new UnauthenticatedError("Invalid token"));
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // Fetch the user with roles and permissions
    const user = await User.findByPk(decoded.id, {
      include: {
        model: Role,
        as: "roles",
        include: {
          model: Permission,
          as: "permissions",
        },
      },
    });

    if (!user) {
      return next(new NotFoundError("User not found"));
    }

    // Collect roles and permissions from the user object
    const roles = user.roles.map((role) => role.role_name);
    const permissions = user.roles.flatMap((role) =>
      role.permissions.map((permission) => permission.permission_name)
    );

    req.accessToken = { value: token, exp: decoded.exp };
    req.user = {
      id: user.id, 
      roles,
      permissions,
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new UnauthenticatedError("Token has expired"));
    } else if (error.name === "JsonWebTokenError") {
      return next(new UnauthenticatedError("Invalid token"));
    } else {
      return next(new UnauthenticatedError(error.message));
    }
  }
};

module.exports = authenticate;
