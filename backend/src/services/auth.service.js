const { get, run } = require("../config/database");
const {
  hashPassword,
  comparePassword
} = require("../utils/password");
const { generateToken } = require("../utils/jwt");
const ApiError = require("../utils/api-error");

async function register({ name, email, password }) {
  const existingUser = await get(
    "SELECT id FROM users WHERE email = ?",
    [email]
  );

  if (existingUser) {
    throw new ApiError(409, "Email already registered");
  }

  const passwordHash = await hashPassword(password);

  const result = await run(
    `
      INSERT INTO users
      (name, email, password_hash)
      VALUES (?, ?, ?)
    `,
    [name, email, passwordHash]
  );

  const token = generateToken({
    id: result.id,
    email
  });

  return {
    token,
    user: {
      id: result.id,
      name,
      email
    }
  };
}

async function login({ email, password }) {
  const user = await get(
    `
      SELECT id, name, email, password_hash
      FROM users
      WHERE email = ?
    `,
    [email]
  );

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const validPassword = await comparePassword(
    password,
    user.password_hash
  );

  if (!validPassword) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = generateToken({
    id: user.id,
    email: user.email
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  };
}

module.exports = {
  register,
  login
};