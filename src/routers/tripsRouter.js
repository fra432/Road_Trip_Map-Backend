const express = require("express");
const { getUserTrips, addTrip } = require("../controllers/tripsControllers");
const auth = require("../server/middlewares/auth");

const tripsRouter = express.Router();

tripsRouter.get("/", auth, getUserTrips);
tripsRouter.post("/", auth, addTrip);

module.exports = tripsRouter;
