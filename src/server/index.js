const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const userRouter = require("../routers/userRouter");

const app = express();

app.disable("x-powered-by");
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/user", userRouter);

module.exports = app;
