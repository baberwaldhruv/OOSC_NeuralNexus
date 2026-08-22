const rightsService = require("../services/rights.service");

async function getRightsInfo(req, res, next) {
  try {
    const statusInfo = await rightsService.getDisputeServiceStatus();
    res.status(200).json(statusInfo);
  } catch (error) {
    next(error);
  }
}

async function analyzeRights(req, res, next) {
  try {
    const { dispute_type, description, location } = req.body;

    if (!dispute_type || !description || !location) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: dispute_type, description, and location are required."
      });
    }

    const aiResponse = await rightsService.analyzeDispute({
      dispute_type,
      description,
      location
    });

    res.status(200).json(aiResponse);
  } catch (error) {
    console.error("Rights Navigator Error Details:", {
      message: error.message,
      responseStatus: error.response?.status,
      responseData: error.response?.data
    });

    res.status(500).json({
      success: false,
      message: error.message,
      aiServiceError: error.response?.data || null
    });
  }
}

module.exports = {
  getRightsInfo,
  analyzeRights
};