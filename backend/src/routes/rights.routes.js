const express = require("express");
const controller = require("../controllers/rights.controller");
const { authenticate } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(authenticate);

router.get("/analyze", controller.getRightsInfo);
router.post("/analyze", controller.analyzeRights);

module.exports = router;