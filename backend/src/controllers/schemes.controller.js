const schemeService = require("../services/scheme.service");

async function checkEligibility(req, res, next) {
  try {
    const { user_query, scheme_context } = req.body;

    if (!user_query || typeof user_query !== "string" || !user_query.trim()) {
      return res.status(400).json({
        success: false,
        message: "Missing required field: 'user_query' is required."
      });
    }

    const aiResponse = await schemeService.checkEligibility(
      user_query.trim(),
      scheme_context ? scheme_context.trim() : ""
    );

    res.status(200).json(aiResponse);
  } catch (error) {
    console.error("Scheme Eligibility Error:", {
      message: error.message,
      responseStatus: error.response?.status,
      responseData: error.response?.data
    });

    res.status(error.response?.status || 500).json({
      success: false,
      message: error.message,
      aiServiceError: error.response?.data || null
    });
  }
}

module.exports = {
  checkEligibility
};