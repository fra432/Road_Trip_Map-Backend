const express = require("express");
const multer = require("multer");
const path = require("path");
const { getTripLocations } = require("../controllers/locationsControllers");
const { getUserTrips, addTrip } = require("../controllers/tripsControllers");
const auth = require("../server/middlewares/auth");
const firebaseImageStore = require("../server/middlewares/firebaseImageStore");
const saveImages = require("../server/middlewares/saveImages");

const uploadLocationImages = multer({
  dest: path.join("uploads", "images"),
  limits: {
    fileSize: 8000000,
  },
});

const tripsRouter = express.Router();

tripsRouter.get("/", auth, getUserTrips);
tripsRouter.get("/:tripId", auth, getTripLocations);
tripsRouter.post(
  "/",
  auth,
  uploadLocationImages.array("image"),
  saveImages,
  firebaseImageStore,
  addTrip
);

module.exports = tripsRouter;
