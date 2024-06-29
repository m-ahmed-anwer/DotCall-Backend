require("dotenv").config();
const usersRoutes = require("./src/routes/userRoutes.js");
const friendsRoutes = require("./src/routes/friendsRoute.js");
// const callRoute = require("./src/routes/callRoute.js");
const tokenRoute = require("./src/routes/tokenRoute.js");
const http = require("http");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const connection = require("./src/db.js");
const User = require("./src/models/userModel.js");
const { initializeSocket } = require("./src/socketManager.js"); // Import socket manager

connection();

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/users", usersRoutes);
app.use("/friends", friendsRoutes);
// app.use("/", callRoute);
app.use("/accessToken", tokenRoute);
app.get("/", (req, res) => {
  res.send("Welcome to DotCall API...");
});

const server = http.createServer(app);

// Initialize Socket.IO
initializeSocket(server);

server.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}.`);
});
