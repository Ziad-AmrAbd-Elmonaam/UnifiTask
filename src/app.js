const express = require("express");
const mongoose = require("mongoose");

const userRoute = require("../routes/userRoute");
const taskRoute = require("../routes/taskRoute");

/********** Run DB Server ***********/
const app = express();
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to DB Successfully!");
  })
  .catch((e) => console.log("DB Error! " + e));

app.use(express.json());

/********** Routes ***********/
app.use(userRoute);
app.use(taskRoute);

/********** Page not found ***********/
app.use((req, res) => {
  res.status(404).json({ msg: "PAGE NOT FOUND!" });
});

/********** Catch all errors ***********/
app.use((error, req, res, next) => {
  res
    .status(error.status || 500)
    .json({ msg: `${error.status || 500} Internal Server Error! ${error}` });
});

module.exports = app;
