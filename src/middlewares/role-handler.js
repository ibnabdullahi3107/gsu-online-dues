const { ForbiddenError } = require("../errors");

const checkRole = (roles) => {
  return async (req, res, next) => {
    try {
      if (!roles.some((role) => req.user.roles.includes(role))) {
        throw new ForbiddenError("You do not have the required role");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = checkRole;
