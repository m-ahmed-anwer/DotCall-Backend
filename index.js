require("dotenv").config();
const usersRoutes = require("./src/routes/userRoutes.js");
const callRoute = require("./src/routes/callRoute.js");
const tokenRoute = require("./src/routes/tokenRoute.js");
const http = require("http");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");
var twilio = require("twilio");

const connection = require("./src/db.js");
connection();

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/users", usersRoutes);
app.use("/", callRoute);
app.use("/accessToken", tokenRoute);

const server = http.createServer(app);
server.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT}.`);
});
