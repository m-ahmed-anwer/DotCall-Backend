const express = require("express");
const {
  addFriends,
  getFriends,
  acceptFriend,
  getFriendsToAccept,
  getAllFriends,
} = require("../controllers/friendsController");
const router = express.Router();

router.post("/addFriends/:userEmail", addFriends);
router.post("/acceptFriend", acceptFriend);
router.post("/getFriends/:userEmail", getFriends);
router.post("/getFriendsToAccept/:userEmail", getFriendsToAccept);
router.post("/getAllFriends/:userInput", getAllFriends);

module.exports = router;
