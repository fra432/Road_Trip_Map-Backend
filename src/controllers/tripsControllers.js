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

const addTrip = async (req, res, next) => {
  debug(chalk.yellowBright("Request to add a trip received"));

  try {
    const { userId, firebaseImagesUrls } = req;
    const { name } = req.body;

    const user = await User.findById(userId);

    const newTrip = {
      name,
      image: firebaseImagesUrls ? firebaseImagesUrls[0] : "",
      owner: userId,
      locations: {
        features: [],
      },
    };

    const addedTrip = await Trip.create(newTrip);
    debug(chalk.greenBright("Location added to database"));

    user.trips.push(addedTrip);

    await User.findByIdAndUpdate(userId, user);

    debug(chalk.greenBright("Trip added to user's trips"));

    res.status(200).json({ new_trip: addedTrip });
  } catch {
    const error = customError(400, "Bad request", "Unable to add new trip");
    next(error);
  }
};

const deleteTrip = async (req, res, next) => {
  debug(chalk.yellowBright("Request to add a trip received"));

  try {
    const { userId } = req;
    const { tripId } = req.params;

    const deletedTrip = await Trip.findByIdAndDelete(tripId);
    if (deletedTrip) {
      debug(chalk.greenBright(`Trip ${tripId} deleted from the database`));

      await User.findByIdAndUpdate(
        userId,
        {
          $pull: { trips: tripId },
        },
        { safe: true, multi: false }
      );

      debug(chalk.greenBright(`Trip ${tripId} deleted from user's trips`));

      res.status(200).json({ deleted_trip: deletedTrip });
    }
  } catch {
    const error = customError(404, "Bad request", "Trip id not found");
    next(error);
  }
};

module.exports = { getUserTrips, addTrip, deleteTrip };
