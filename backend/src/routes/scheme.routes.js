const express = require("express");
const controller = require("../controllers/schemes.controller");
const { authenticate } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(authenticate);

router.post("/eligibility", controller.checkEligibility);
router.post("/check-eligibility", controller.checkEligibility);

module.exports = router;