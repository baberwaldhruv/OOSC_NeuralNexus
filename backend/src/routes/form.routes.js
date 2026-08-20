const express = require("express");

const controller = require("../controllers/forms.controller");
const { authenticate } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(authenticate);

router.post(
  "/fill",
  controller.fillForm
);

module.exports = router;