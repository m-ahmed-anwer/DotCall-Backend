const express = require("express");
const {
  addFriends,
  getFriends,
  acceptFriend,
  getFriendsToAccept,
} = require("../controllers/friendsController");
const router = express.Router();

router.post("/addFriends/:userEmail", addFriends);
router.post("/acceptFriend", acceptFriend);
router.post("/getFriends/:userEmail", getFriends);
router.post("/getFriendsToAccept/:userEmail", getFriendsToAccept);

module.exports = router;
