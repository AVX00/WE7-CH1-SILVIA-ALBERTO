require("dotenv").config();
const debug = require("debug")("series:root");
const chalk = require("chalk");
const connectDB = require("./database");
const app = require("./server");
const upServer = require("./server/upServer");

const port = process.env.PORT || 4000;
const dbstring = process.env.MONGO_STRING(async () => {
  try {
    await connectDB(dbstring);
    await upServer(port, app);
  } catch (error) {
    debug(chalk.red(`Error:`, error.message));
  }
})();
