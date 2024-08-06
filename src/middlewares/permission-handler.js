const { ForbiddenError } = require("../errors");

const checkPermission = (permissions) => {
  return async (req, res, next) => {
    try {
      if (
        !permissions.some((permission) =>
          req.user.permissions.includes(permission)
        )
      ) {
        throw new ForbiddenError("You do not have the required permission");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = checkPermission;
