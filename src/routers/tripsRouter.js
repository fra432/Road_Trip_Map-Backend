const express = require("express");
const { getUserTrips } = require("../controllers/tripsControllers");
const auth = require("../server/middlewares/auth");

const tripsRouter = express.Router();

tripsRouter.get("/", auth, getUserTrips);

module.exports = tripsRouter;
