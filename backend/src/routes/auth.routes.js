const express = require("express");

const controller = require("../controllers/auth.controller");

const {
  registerValidator,
  loginValidator
} = require("../validators/auth.validator");

const validate = require("../middleware/validation.middleware");

const router = express.Router();

router.post(
  "/register",
  registerValidator,
  validate,
  controller.register
);

router.post(
  "/login",
  loginValidator,
  validate,
  controller.login
);

module.exports = router;