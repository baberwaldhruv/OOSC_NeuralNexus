const app = require("./app");
const env = require("./config/env");
const {
  initializeDatabase
} = require("./config/database");

async function startServer() {
  try {
    await initializeDatabase();

    app.listen(env.port, () => {
      console.log(
        `VakilAI backend running on port ${env.port}`
      );

      console.log(
        `http://localhost:${env.port}/health`
      );
    });
  } catch (error) {
    console.error(
      "Failed to start server:",
      error
    );

    process.exit(1);
  }
}

startServer();