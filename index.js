require("dotenv").config();
const usersRoutes = require("./src/routes/userRoutes.js");
const express = require("express");
const mongoose = require("mongoose");

const connection = require("./src/db.js");
connection();

const app = express();
app.use(express.json());

app.use("/users", usersRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT}.`);
});
