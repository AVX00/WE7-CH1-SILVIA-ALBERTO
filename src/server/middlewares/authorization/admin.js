const User = require("../../../database/models/User");

const admin = (req, res, next) => {
  try {
    const user = User.findOne({ id: req.userId });

    if (user.admin) {
      next();
      return;
    }
    res.status(403).json({ error: "permission denied" });
  } catch (error) {
    next(error);
  }
};

module.exports = admin;
