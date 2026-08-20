const express = require("express");

const controller = require("../controllers/rights.controller");
const { authenticate } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(authenticate);

router.post(
  "/analyze",
  controller.getRights
);

module.exports = router;