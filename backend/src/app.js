const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const env = require("./config/env");

const { apiLimiter } = require("./middleware/rate-limit.middleware");
const errorMiddleware = require("./middleware/error.middleware");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const rtiRoutes = require("./routes/rti.routes");

const app = express();

app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true
  })
);

app.use(helmet());

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.use("/api", apiLimiter);

app.get("/health", (req, res) => {
  res.json({
    success: true,
    service: "VakilAI Backend",
    status: "healthy"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/rti", rtiRoutes);

/*
 * These will be implemented next.
 */
app.use("/api/rights-navigator", require("./routes/rights.routes"));
app.use("/api/schemes", require("./routes/scheme.routes"));
app.use("/api/forms", require("./routes/form.routes"));

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

app.use(errorMiddleware);

module.exports = app;