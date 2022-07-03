require("dotenv").config();
const debug = require("debug")("recordswapp:server:middlewares:errors");
const chalk = require("chalk");
const customError = require("../../utils/customError");

const notFoundError = (req, res, next) => {
  const error = customError(404, "Endpoint not found");
  debug(chalk.red(error.message));

  next(error);
};

// eslint-disable-next-line no-unused-vars
const generalError = (error, req, res, next) => {
  const message = error.customMessage ?? "General Error";
  const statusCode = error.statusCode ?? 500;
  debug(chalk.red(error.message));
  res.status(statusCode).json({ error: true, message });
};

module.exports = {
  notFoundError,
  generalError,
};
