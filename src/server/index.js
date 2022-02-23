const express = require("express");
const morgan = require("morgan");
const platformRouter = require("./routers/platformsRouter");
const usersRouter = require("./routers/usersRouter");

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.use("/users", usersRouter);
app.use("/platforms", platformRouter);
module.exports = app;
