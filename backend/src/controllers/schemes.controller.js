async function checkEligibility(req, res) {
  res.json({
    success: true,
    message: "Government Scheme Eligibility module",
    status: "coming_soon"
  });
}

module.exports = {
  checkEligibility
};