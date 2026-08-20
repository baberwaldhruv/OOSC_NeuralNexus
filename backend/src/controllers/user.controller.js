const userService = require("../services/user.service");

async function getProfile(req, res, next) {
  try {
    const user = await userService.getProfile(req.user.id);

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProfile
};