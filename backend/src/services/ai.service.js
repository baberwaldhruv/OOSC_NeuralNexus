const axios = require("axios");
const env = require("../config/env");

const aiClient = axios.create({
  baseURL: env.aiBaseUrl,
  timeout: 120000,
  headers: {
    "Content-Type": "application/json"
  }
});

async function checkHealth() {
  const response = await aiClient.get("/health");

  return response.data;
}

async function rtiChat(sessionId, message) {
  const response = await aiClient.post(
    "/api/chat/",
    null,
    {
      params: {
        session_id: sessionId,
        message
      }
    }
  );

  return response.data;
}

/*
 * IMPORTANT:
 * Your friend's documentation does not yet define
 * the request/response body for /api/rti/draft.
 *
 * Once that contract is finalized, implement it here.
 */
async function generateRtiDraft(caseData) {
  const response = await aiClient.post(
    "/api/rti/draft",
    caseData
  );

  return response.data;
}

module.exports = {
  checkHealth,
  rtiChat,
  generateRtiDraft
};