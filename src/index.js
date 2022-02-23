require("dotenv").config();
const debug = require("debug")("series:root");
const chalk = require("chalk");
const upServer = require("./server/upServer");

const port = process.env.PORT || 4000;
const dbString = process.env.MONGO_STRING;

(async () => {
  try {
    await connectDataBase(dbString);
    await upServer(port, app);
  } catch (error) {
    debug(chalk.red(`Error:`, error.message));
  }
})();
