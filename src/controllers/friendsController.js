const Friends = require("../models/friendModel.js");

const addFriends = async (req, res) => {
  const { email, name, username } = req.body;
  const { userEmail } = req.params;

  try {
    const user = await Friends.findOne({ email: userEmail });
    const usertoAdd = await Friends.findOne({ email: email });

    if (!user || !usertoAdd) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check if the email address already exists in the friends array

    const friend = user.friends.find((friends) => friends.email === email);

    const existingFriend = user.friendsToGetAccepted.find(
      (friendsToGetAccepted) => friendsToGetAccepted.email === email
    );

    const existingFriendToAdd = usertoAdd.friendsToAccept.find(
      (friendsToAccept) => friendsToAccept.email === userEmail
    );

    if (friend || existingFriend || existingFriendToAdd) {
      return res.status(400).json({
        success: false,
        message: "Friend already Accepted",
      });
    }

    usertoAdd.friendsToAccept.push({
      name: user.name,
      email: user.email,
      username: user.username,
    });

    user.friendsToGetAccepted.push({ name, email, username });

    await user.save();
    await usertoAdd.save();

    res
      .status(200)
      .json({ success: true, message: "Friend accepted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const acceptFriend = async (req, res) => {
  const { email, acceptingUserEmail } = req.body;

  try {
    const user = await Friends.findOne({ email: acceptingUserEmail });
    const userGettingAccepted = await Friends.findOne({ email: email });

    if (!user || !userGettingAccepted) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const existingFriendIndex = user.friendsToAccept.findIndex(
      (friend) => friend.email === email
    );

    if (existingFriendIndex === -1) {
      return res.status(400).json({
        success: false,
        message: "Friend not found in friendsToAccept",
      });
    }
    const existingFriend = user.friendsToAccept[existingFriendIndex];

    user.friendsToAccept.splice(existingFriendIndex, 1);

    const existingFriendAcceptedIndex =
      userGettingAccepted.friendsToGetAccepted.findIndex(
        (friend) => friend.email === acceptingUserEmail
      );
    if (existingFriendAcceptedIndex === -1) {
      return res.status(400).json({
        success: false,
        message: "Friend not found in friendsToGetAccept",
      });
    }

    const existingFriendGettingAccepted =
      userGettingAccepted.friendsToGetAccepted[existingFriendAcceptedIndex];

    userGettingAccepted.friendsToGetAccepted.splice(
      existingFriendAcceptedIndex,
      1
    );

    user.friends.push(existingFriend);
    userGettingAccepted.friends.push(existingFriendGettingAccepted);

    await user.save();
    await userGettingAccepted.save();

    res
      .status(200)
      .json({ success: true, message: "Friend added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getFriends = async (req, res) => {
  const { userEmail } = req.params;

  try {
    const user = await Friends.findOne({ email: userEmail });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, friends: user.friends });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getFriendsToAccept = async (req, res) => {
  const { userEmail } = req.params;

  try {
    const user = await Friends.findOne({ email: userEmail });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res
      .status(200)
      .json({ success: true, friendsToAccept: user.friendsToAccept });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getAllFriends = async (req, res) => {
  const { userInput } = req.params;
  const { email } = req.body;

  try {
    const user = await Friends.findOne({ email });
    const friends = await Friends.find({});

    // Filter out the three user lists
    const excludedUsernames = [
      ...user.friends.map((friend) => friend.username),
      ...user.friendsToAccept.map((friend) => friend.username),
      ...user.friendsToGetAccepted.map((friend) => friend.username),
    ];

    const matchingUsers = friends.filter((friend) => {
      return (
        !excludedUsernames.includes(friend.username) &&
        friend.username.includes(userInput) &&
        friend.email !== email
      );
    });

    res.json({
      matchingUsers: matchingUsers.map((friend) => ({
        name: friend.name,
        username: friend.username,
        email: friend.email,
        allowRecordCaller: friend.allowRecordCaller,
        allowRecordCurrentUser: friend.allowRecordCurrentUser,
      })),
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateRecordStat = async (req, res) => {
  const { currentUserMail } = req.params;
  const { callerEmail } = req.body;

  try {
    const user = await Friends.findOne({ email: currentUserMail });
    const caller = await Friends.findOne({ email: callerEmail });

    // Filter out the three user lists
    const currentUserFriend = user.friends.find(
      (friends) => friends.email === callerEmail
    );
    const callerFriend = caller.friends.find(
      (friends) => friends.email === currentUserMail
    );

    callerFriend.allowRecordCurrentUser = !callerFriend.allowRecordCurrentUser;
    currentUserFriend.allowRecordCaller = !currentUserFriend.allowRecordCaller;

    res.json({
      user: {
        name: currentUserFriend.name,
        username: currentUserFriend.username,
        email: currentUserFriend.email,
        allowRecordCaller: currentUserFriend.allowRecordCaller,
        allowRecordCurrentUser: currentUserFriend.allowRecordCurrentUser,
      },
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getRecordStat = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await Friends.findOne({ email: currentUserMail });
    const friend = user.friends.find((friends) => friends.email === email);
    
    res.json({
      user: {
        name: friend.name,
        username: friend.username,
        email: friend.email,
        allowRecordCaller: friend.allowRecordCaller,
        allowRecordCurrentUser: friend.allowRecordCurrentUser,
      },
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getFriends,
  addFriends,
  acceptFriend,
  getFriendsToAccept,
  getAllFriends,
  updateRecordStat,
  getRecordStat,
};
