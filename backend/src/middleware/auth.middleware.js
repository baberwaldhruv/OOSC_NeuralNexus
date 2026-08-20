const { verifyToken } = require("../utils/jwt");
const ApiError = require("../utils/api-error");

function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      throw new ApiError(401, "Authentication required");
    }

    const token = header.substring(7);

    const decoded = verifyToken(token);

    req.user = decoded;

    next();
  } catch (error) {
    next(
      error instanceof ApiError
        ? error
        : new ApiError(401, "Invalid or expired token")
    );
  }
}

module.exports = {
  authenticate
};