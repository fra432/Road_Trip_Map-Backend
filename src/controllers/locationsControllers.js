require("dotenv").config();
const debug = require("debug")("recordswapp:controllers:recordsControllers");
const chalk = require("chalk");
const Location = require("../models/Location");
const Trip = require("../models/Trip");
const customError = require("../utils/customError");

const getTripLocations = async (req, res, next) => {
  debug(chalk.yellowBright("Request to get user's locations received"));

  try {
    const { tripId } = req.params;

    const {
      name,
      locations: { features },
    } = await Trip.findById(tripId).populate({
      path: "locations",
      populate: {
        path: "features",
        model: Location,
      },
    });

    res.status(200).json({ name, tripId, features });
  } catch {
    const error = customError(400, "Bad Request", "Trip not found");
    next(error);
  }
};

const addLocation = async (req, res, next) => {
  debug(chalk.yellowBright("Request to add a location received"));
  try {
    const { tripId } = req.params;
    const { latitude, longitude, description, name } = req.body;
    const { files, firebaseImagesUrls } = req;

    const trip = await Trip.findById(tripId);

    const newLocation = {
      type: "Feature",
      trip: tripId,
      properties: {
        name,
        description,
        images: files.length !== 0 ? [...firebaseImagesUrls] : [],
      },
      geometry: {
        type: "Point",
        coordinates: [+latitude, +longitude],
      },
    };

    const addedLocation = await Location.create(newLocation);
    debug(chalk.greenBright("Location added to database"));

    trip.locations.features.push(addedLocation);

    await Trip.findByIdAndUpdate(tripId, trip);

    debug(chalk.greenBright("Location added to user locations"));

    res.status(200).json({ new_location: addedLocation });
  } catch {
    const error = customError(400, "Bad request", "Unable to add new location");
    next(error);
  }
};

const deleteLocation = async (req, res, next) => {
  debug(chalk.yellowBright("Request to delete a location received"));
  const { locationId } = req.params;

  const deletedLocation = await Location.findByIdAndDelete(locationId);
  if (deletedLocation) {
    debug(
      chalk.greenBright(
        `Location ${locationId} deleted from locations database`
      )
    );

    const tripId = deletedLocation.trip;

    await Trip.findByIdAndUpdate(
      tripId,
      {
        $pull: { "locations.features": locationId },
      },
      { safe: true, multi: false }
    );

    debug(
      chalk.greenBright(`Location ${locationId} deleted from user's locations`)
    );

    res.status(200).json({ deleted_location: deletedLocation });
    return;
  }

  const error = customError(404, "Bad request", "Location id not found");
  next(error);
};

const getLocationById = async (req, res, next) => {
  const { locationId } = req.params;
  debug(chalk.yellowBright(`Request to get location ${locationId} received`));
  try {
    const {
      id,
      properties: { name, description, images },
    } = await Location.findById(locationId);
    const location = { id, name, description, images };
    res.status(200).json({ location });
  } catch {
    const error = customError(400, "Bad Request", "Location not found");
    next(error);
  }
};

module.exports = {
  getTripLocations,
  addLocation,
  deleteLocation,
  getLocationById,
};
