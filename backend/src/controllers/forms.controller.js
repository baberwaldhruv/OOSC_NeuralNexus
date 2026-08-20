async function fillForm(req, res) {
  res.json({
    success: true,
    message: "Conversational Form Filler module",
    status: "coming_soon"
  });
}

module.exports = {
  fillForm
};