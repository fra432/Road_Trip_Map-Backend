const { Schema, model } = require("mongoose");

const LocationSchema = new Schema({
  type: {
    type: String,
    default: "Feature",
  },
  properties: {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  geometry: {
    type: {
      type: String,
      default: "Point",
    },
    coordinates: [
      {
        type: Number,
        required: true,
      },
    ],
  },
});

const Location = model("Location", LocationSchema, "locations");

module.exports = Location;
