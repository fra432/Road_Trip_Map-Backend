const { Schema, model } = require("mongoose");

const TripSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
  },
  locations: {
    features: {
      type: [{ type: Schema.Types.ObjectId, ref: "Location" }],
      default: [],
    },
  },
});

const Trip = model("Trip", TripSchema, "trips");

module.exports = Trip;
