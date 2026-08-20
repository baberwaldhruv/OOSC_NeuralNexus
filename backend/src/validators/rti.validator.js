const { body } = require("express-validator");

const chatValidator = [
  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required")
    .isLength({ max: 5000 })
    .withMessage("Message is too long")
];

module.exports = {
  chatValidator
};