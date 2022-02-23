const chalk = require("chalk");

const debug = require("debug")("series:error:");

const notFound = (req, res) => {
  debug(
    chalk.bgRed.black(
      `${req.ip ?? "client"} requested at a not regulated endpoint`
    )
  );
  res.status(404).json({ error: "not found " });
};

// eslint-disable-next-line no-unused-vars
const generalError = (err, req, res, next) => {
  const status = err.status ?? 500;
  const message = err.message ?? "server error";
  res.status(status).json({ error: message });
};

module.exports = { notFound, generalError };
