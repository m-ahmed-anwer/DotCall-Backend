const express = require("express");
const {
  addFriends,
  getFriends,
  acceptFriend,
  getFriendsToAccept,
  getAllFriends,
  updateRecordStatTRUE,
  updateRecordStatFALSE,
  getRecordStat,
} = require("../controllers/friendsController");
const router = express.Router();

router.post("/addFriends/:userEmail", addFriends);
router.post("/acceptFriend", acceptFriend);
router.post("/getFriends/:userEmail", getFriends);
router.post("/getFriendsToAccept/:userEmail", getFriendsToAccept);
router.post("/getAllFriends/:userInput", getAllFriends);
router.post("/updateRecordStatTRUE/:currentUserMail", updateRecordStatTRUE);
router.post("/updateRecordStatFALSE/:currentUserMail", updateRecordStatFALSE);
router.post("/getRecordStat/:currentUserMail", getRecordStat);

module.exports = router;
