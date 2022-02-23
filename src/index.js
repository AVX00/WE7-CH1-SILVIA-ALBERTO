require("dotenv").config();
const debug = require("debug")("series:root");
const chalk = require("chalk");
const upServer = require("./server/upServer");

const port = process.env.PORT || 4000;

(async () => {
  try {
    await upServer(port);
  } catch (error) {
    debug(chalk.red(`Error:`, error.message));
  }
})();
