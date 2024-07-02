const express = require("express");
const {
  addFriends,
  getFriends,
  acceptFriend,
  getFriendsToAccept,
  getAllFriends,
  updateRecordStat,
  getRecordStat,
} = require("../controllers/friendsController");
const router = express.Router();

router.post("/addFriends/:userEmail", addFriends);
router.post("/acceptFriend", acceptFriend);
router.post("/getFriends/:userEmail", getFriends);
router.post("/getFriendsToAccept/:userEmail", getFriendsToAccept);
router.post("/getAllFriends/:userInput", getAllFriends);
router.post("/updateRecordStat/:currentUserMail", updateRecordStat);
router.post("/getUserRecordance/:email", getRecordStat);

module.exports = router;
