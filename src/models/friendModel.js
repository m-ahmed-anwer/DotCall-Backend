const mongoose = require("mongoose");

const friendsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    friends: [
      {
        name: { type: String, required: true },
        username: { type: String, required: true },
        email: { type: String, required: true },
      },
    ],
  },
  {
    collection: "friends",
  }
);

friendsSchema.path("friends").required(false);

const Friends = mongoose.model("Friends", friendsSchema);

module.exports = Friends;
