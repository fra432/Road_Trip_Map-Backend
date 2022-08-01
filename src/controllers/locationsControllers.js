require("dotenv").config();
const debug = require("debug")("recordswapp:controllers:recordsControllers");
const chalk = require("chalk");
const Location = require("../models/Location");
const User = require("../models/User");
const customError = require("../utils/customError");

const getUserLocations = async (req, res, next) => {
  debug(chalk.yellowBright("Request to get user's locations received"));

  try {
    const { userId } = req;

    const {
      locations: { features },
    } = await User.findById(userId).populate({
      path: "locations",
      populate: {
        path: "features",
        model: Location,
      },
    });

    res.status(200).json({ features });
  } catch {
    const error = customError(400, "Bad Request", "User not found");
    next(error);
  }
};

const addLocation = async (req, res, next) => {
  debug(chalk.yellowBright("Request to add a location received"));

  try {
    const { userId } = req;
    const { latitude, longitude, description, name } = req.body;
    const { files, firebaseImagesUrls } = req;

    const user = await User.findById(userId);

    const newLocation = {
      type: "Feature",
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

    user.locations.features.push(addedLocation);

    await User.findByIdAndUpdate(userId, user);

    debug(chalk.greenBright("Location added to user locations"));

    res.status(200).json({ new_location: addedLocation });
  } catch {
    const error = customError(400, "Bad request", "Unable to add new location");
    next(error);
  }
};

const deleteLocation = async (req, res, next) => {
  debug(chalk.yellowBright("Request to delete a location received"));
  const { userId } = req;
  const { locationId } = req.params;

  const deletedLocation = await Location.findByIdAndDelete(locationId);
  if (deletedLocation) {
    debug(
      chalk.greenBright(
        `Location ${locationId} deleted from locations database`
      )
    );

    await User.findByIdAndUpdate(
      userId,
      {
        $pull: { "locations.features": locationId },
      },
      { new: true }
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
  getUserLocations,
  addLocation,
  deleteLocation,
  getLocationById,
};
