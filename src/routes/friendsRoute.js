const express = require("express");
const {
  addFriends,
  getFriends,
  acceptFriend,
} = require("../controllers/friendsController");
const router = express.Router();

router.post("/addFriends/:userEmail", addFriends);
router.post("/getFriends/:userEmail", getFriends);
router.post("/acceptFriend", acceptFriend);

module.exports = router;
