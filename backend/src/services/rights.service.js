const axios = require("axios");

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "https://oosc-neuralnexus.onrender.com";

async function analyzeDispute(data) {
  const response = await axios.post(
    `${AI_SERVICE_URL}/api/rights-navigator/analyze`,
    null, // empty body
    {
      params: {
        dispute_type: data.dispute_type,
        description: data.description,
        location: data.location
      },
      timeout: 60000
    }
  );
  return response.data;
}

module.exports = {
  analyzeDispute
};