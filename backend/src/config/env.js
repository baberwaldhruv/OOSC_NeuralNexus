require("dotenv").config();

const env = {
  port: process.env.PORT || 5000,

  nodeEnv: process.env.NODE_ENV || "development",

  jwtSecret: process.env.JWT_SECRET,

  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",

  aiBaseUrl:
    process.env.AI_BASE_URL ||
    "https://oosc-neuralnexus.onrender.com",

  corsOrigin:
    process.env.CORS_ORIGIN ||
    "http://localhost:5173"
};

if (!env.jwtSecret) {
  throw new Error("JWT_SECRET is missing in .env");
}

module.exports = env;