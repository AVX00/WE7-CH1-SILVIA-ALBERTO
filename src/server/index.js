const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const { notFound, generalError } = require("./middlewares/errors");
const platformRouter = require("./routers/platformsRouter");
const usersRouter = require("./routers/usersRouter");

const app = express();

app.use(helmet.hidePoweredBy());
app.use(morgan("dev"));
app.use(express.json());

app.use("/users", usersRouter);
app.use("/platforms", platformRouter);

app.use(notFound);
app.use(generalError);
module.exports = app;
