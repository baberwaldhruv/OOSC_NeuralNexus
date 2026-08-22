const axios = require("axios");

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "https://oosc-neuralnexus.onrender.com";

async function checkEligibility(userQuery, schemeContext = "") {
  const response = await axios.post(
    `${AI_SERVICE_URL}/api/scheme/check-eligibility`,
    {
      user_query: userQuery,
      scheme_context: schemeContext
    },
    {
      headers: {
        "Content-Type": "application/json"
      },
      timeout: 60000
    }
  );
  return response.data;
}

module.exports = {
  checkEligibility
};