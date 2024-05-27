require("dotenv").config();
const usersRoutes = require("./src/routes/userRoutes.js");
const callRoute = require("./src/routes/callRoute.js");
const tokenRoute = require("./src/routes/tokenRoute.js");
const http = require("http");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

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

// require("dotenv").config();
// const express = require("express");
// const bodyParser = require("body-parser");
// const http = require("http");
// const { Server } = require("socket.io");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");

// // Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// // Create an express app
// const app = express();

// // Configure express app
// app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: false }));

// // Define routes
// const usersRoutes = require("./src/routes/userRoutes.js");
// const callRoute = require("./src/routes/callRoute.js");
// const tokenRoute = require("./src/routes/tokenRoute.js");
// app.use("/users", usersRoutes);
// app.use("/", callRoute);
// app.use("/accessToken", tokenRoute);

// // Create an HTTP server
// const server = http.createServer(app);

// // Create a new socket.io instance and attach it to the server
// const io = new Server(server);

// // Handle incoming WebSocket connections
// io.on("connection", (socket) => {
//   console.log("A user connected");

//   // Handle disconnection
//   socket.on("disconnect", () => {
//     console.log("A user disconnected");
//   });
// });

// // Start the server
// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
