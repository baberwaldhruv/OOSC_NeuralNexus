const express = require("express");

const controller = require("../controllers/user.controller");
const { authenticate } = require("../middleware/auth.middleware");

const router = express.Router();

router.get(
  "/profile",
  authenticate,
  controller.getProfile
);

module.exports = router;