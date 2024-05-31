const express = require("express");
const { addFriends, getFriends } = require("../controllers/friendsController");
const router = express.Router();

router.post("/addFriends/:userEmail", addFriends);
router.post("/getFriends/:userEmail", getFriends);

module.exports = router;
