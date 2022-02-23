const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../../database/models/User");

const userLogin = async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  const isRightPassword = await bcrypt.compare(password, user?.password ?? "");

  if (!user || !isRightPassword) {
    const error = new Error("Incorrect password or username");
    error.code = 401;
    next(error);
    return;
  }

  const userData = {
    name: user.name,
    id: user.id,
  };
  const token = jwt.sign(userData, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.json({ token });
};

module.exports = userLogin;
