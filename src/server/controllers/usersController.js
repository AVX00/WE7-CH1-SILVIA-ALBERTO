const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../../database/models/User");

const userLogin = async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  const isRightPassword = await bcrypt.compare(password, user?.password ?? "");

  if (!user || !isRightPassword) {
    const error = new Error("Incorrect password or username");
    error.status = 401;
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

const userRegister = async (req, res, next) => {
  try {
    const password = await bcrypt.hash(req.body.password, 10);

    req.body.password = password;
    const user = await User.create(req.body);

    res.status(201).json({ user });
  } catch (error) {
    error.code = 400;
    next(error);
  }
};

module.exports = { userLogin, userRegister };
