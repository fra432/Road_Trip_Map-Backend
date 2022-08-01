require("dotenv").config();
const debug = require("debug")("recordswapp:controllers:recordsControllers");
const chalk = require("chalk");
const Trip = require("../models/Trip");
const User = require("../models/User");
const customError = require("../utils/customError");

const getUserTrips = async (req, res, next) => {
  debug(chalk.yellowBright("Request to get user's trips received"));
  const { userId } = req;
  try {
    const { trips } = await User.findById(userId).populate({
      path: "trips",
      model: Trip,
    });

    res.status(200).json({ trips });
  } catch {
    const error = customError(400, "Bad request", "User not found");
    next(error);
  }
};

module.exports = { getUserTrips };
