const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const headerAuthorization = req.header("Authorization");
  if (!headerAuthorization) {
    const error = new Error("Token Missing");
    error.status = 401;
    next(error);
  } else {
    const token = headerAuthorization.replace("Bearer ", "");
    try {
      jwt.verify(token, process.env.JWT_SECRET);
      next();
    } catch {
      const error = new Error("Wrong Token");
      error.status = 401;
      next(error);
    }
  }
};

module.exports = auth;
