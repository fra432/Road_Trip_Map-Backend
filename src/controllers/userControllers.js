require("dotenv").config();
const chalk = require("chalk");
const debug = require("debug")("road_trip_map:controllers:userControllers");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const User = require("../models/User");
const customError = require("../utils/customError");

const userLogin = async (req, res, next) => {
  debug(chalk.yellowBright("login request received"));
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    const error = customError(
      403,
      "Bad request",
      "Username or Password incorrect"
    );
    next(error);
    return;
  }

  const userData = {
    id: user.id,
    username: user.username,
  };

  const rightPassword = await bcrypt.compare(password, user.password);

  if (!rightPassword) {
    const error = customError(403, "Bad request", "Password incorrect");
    next(error);
    return;
  }

  const token = jsonwebtoken.sign(userData, process.env.JWT_SECRET);

  res.status(200).json({ token });
};

const userRegister = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (user) {
      const error = customError(409, "Conflict", "User already exists");
      next(error);
      return;
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      username,
      password: encryptedPassword,
    };

    await User.create(newUser);

    res.status(201).json({ new_user: { username } });
  } catch {
    const error = customError(400, "Bad request", "Wrong user data");
    next(error);
  }
};

module.exports = { userLogin, userRegister };
