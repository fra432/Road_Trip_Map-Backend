const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  trips: {
    type: [{ type: Schema.Types.ObjectId, ref: "Trip" }],
  },
});

const User = model("User", UserSchema, "users");

module.exports = User;
