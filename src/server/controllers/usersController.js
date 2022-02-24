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
  const user = req.body;

  try {
    const userNameTaken = await User.findOne({ username: user.username });
    if (userNameTaken) {
      res.status(409).json({ error: "username taken" });
      return;
    }
    const password = await bcrypt.hash(user.password, 10);
    const newUser = await User.create({ ...user, password });
    res.status(201).json(newUser);
  } catch (error) {
    error.message = "failed to create user";
    next(error);
  }
};

module.exports = { userLogin, userRegister };
