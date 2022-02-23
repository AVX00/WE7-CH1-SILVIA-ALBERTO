const express = require("express");
const morgan = require("morgan");
const usersRouter = require("./routers/usersRouter");

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.use("/users", usersRouter);

module.exports = app;
