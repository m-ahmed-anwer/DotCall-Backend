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

// Socket.IO setup
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust this as necessary for your setup
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("a user connected: ", socket.id);

  socket.on("disconnect", () => {
    console.log("user disconnected: ", socket.id);
  });

  // Example event for signaling (you can customize this as needed)
  socket.on("signal", (data) => {
    console.log("Signal received:", data);
    // Broadcast the signal to all other clients
    socket.broadcast.emit("signal", data);
  });

  // Handle other custom events
  socket.on("customEvent", (data) => {
    console.log("Custom event received:", data);
    // Emit an event to the client
    socket.emit("response", { message: "Custom event processed" });
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}.`);
});
