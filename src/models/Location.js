const { Schema, model } = require("mongoose");

const LocationSchema = new Schema({
  type: {
    type: String,
    default: "Feature",
  },
  trip: {
    type: Schema.Types.ObjectId,
    ref: "Trip",
  },
  properties: {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    images: {
      type: [
        {
          type: String,
        },
      ],
      default: [],
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
