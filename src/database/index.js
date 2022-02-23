/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const chalk = require("chalk");
const { default: mongoose } = require("mongoose");
const debug = require("debug")("series:database:");

const connectDB = (uri) =>
  new Promise((resolve, reject) => {
    mongoose.set("toJSON", {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
      },
    });
    mongoose.connect(uri, (error) => {
      if (error) {
        debug(chalk.red(error.message));
        reject();
        return;
      }

      debug(chalk.green("Database connected"));
      resolve();
    });
  });

module.exports = connectDB;
