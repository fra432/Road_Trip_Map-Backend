const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  getUserLocations,
  addLocation,
} = require("../controllers/locationsControllers");
const firebaseImageStore = require("../server/middlewares/firebaseImageStore");
const saveImages = require("../server/middlewares/saveImages");

const uploadLocationImages = multer({
  dest: path.join("uploads", "images"),
  limits: {
    fileSize: 8000000,
  },
});

const locationsRouter = express.Router();

locationsRouter.get("/:userId", getUserLocations);

locationsRouter.post(
  "/:userId",
  uploadLocationImages.array("image"),
  saveImages,
  firebaseImageStore,
  addLocation
);

module.exports = locationsRouter;
