require("dotenv").config();
const chalk = require("chalk");
const debug = require("debug")("road_trip_map:controllers:userControllers");

const userLogin = (/* req, res, next */) => {
  debug(chalk.yellowBright("login request received"));
  /* const {username, password} = req.body */
};

module.exports = { userLogin };
