const { get } = require("../config/database");
const ApiError = require("../utils/api-error");

async function getProfile(userId) {
  const user = await get(
    `
      SELECT id, name, email, created_at
      FROM users
      WHERE id = ?
    `,
    [userId]
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
}

module.exports = {
  getProfile
};