const chalk = require("chalk");

const debug = require("debug")("series:error:");

const notFound = (req, res) => {
  debug(chalk.bgRed.black(`${req.ip} requested at a not regulated endpoint`));
  res.status(404).json({ error: "not found " });
};

module.exports = { notFound };
