const express = require("express");
const { getTripLocations } = require("../controllers/locationsControllers");
const { getUserTrips, addTrip } = require("../controllers/tripsControllers");
const auth = require("../server/middlewares/auth");

const tripsRouter = express.Router();

tripsRouter.get("/", auth, getUserTrips);
tripsRouter.get("/:tripId", auth, getTripLocations);
tripsRouter.post("/", auth, addTrip);

module.exports = tripsRouter;
