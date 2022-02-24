const debug = require("debug")("series:platform:");
const chalk = require("chalk");
const Platform = require("../../database/models/Platform");

const getPlatforms = async (req, res, next) => {
  try {
    const platforms = await Platform.find();
    res.json(platforms);
  } catch (error) {
    error.message = "error getting Platforms";
    debug(chalk.bgRed.black("error getting platforms"));
    next(error);
  }
};

const newPlatform = async (req, res, next) => {
  try {
    const platform = await Platform.create(req.body);
    res.status(201).json(platform);
  } catch (error) {
    error.status = 400;
    next(error);
  }
};

module.exports = { getPlatforms, newPlatform };
