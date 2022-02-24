const User = require("../../../database/models/User");

const admin = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.userId });
    if (user.admin) {
      next();
      return;
    }
    res.status(403).json({ error: "permission denied" });
  } catch (error) {
    error.message = "no user with provided id";
    next(error);
  }
};

module.exports = admin;
