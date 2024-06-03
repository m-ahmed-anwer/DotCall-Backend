const Friends = require("../models/friendModel.js");

const addFriends = async (req, res) => {
  const { email, name, username } = req.body;
  const { userEmail } = req.params;

  try {
    const user = await Friends.findOne({ email: userEmail });
    const usertoAdd = await Friends.findOne({ email: email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (!usertoAdd) {
      return res
        .status(404)
        .json({ success: false, message: "No User to add" });
    }

    // Check if the email address already exists in the friends array
    const existingFriend = user.friendsToGetAccepted.find(
      (friendsToGetAccepted) => friendsToGetAccepted.email === email
    );
    if (existingFriend) {
      return res.status(400).json({
        success: false,
        message: "Friend already Accepted",
      });
    }

    const existingFriendToAdd = usertoAdd.friendsToAccept.find(
      (friendsToAccept) => friendsToAccept.email === email
    );
    if (existingFriendToAdd) {
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

    user.friendsToGetAccept.push({ name, email, username });

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
  const { email } = req.body;
  const { userEmail } = req.params;

  try {
    const user = await Friends.findOne({ email: userEmail });

    const userGettingAccepted = await Friends.findOne({ email: email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const existingFriendIndex = user.friendsToAccept.findIndex(
      (friendsToAccept) => friendsToAccept.email === email
    );
    if (existingFriendIndex === -1) {
      return res.status(400).json({
        success: false,
        message: "Friend not found in friendsToAccept",
      });
    }

    const existingFriend = user.friendsToAccept[existingFriendIndex];

    user.friendsToAccept = user.friendsToAccept.filter(
      (friend, index) => index !== existingFriendIndex
    );

    const existingFriendAcceptedIndex =
      userGettingAccepted.friendsToGetAccept.findIndex(
        (friendsToGetAccept) => friendsToGetAccept.email === userEmail
      );
    if (existingFriendAcceptedIndex === -1) {
      return res.status(400).json({
        success: false,
        message: "Friend not found in friendsToGetAccept",
      });
    }
    const existingFriendGettingaccepted =
      userGettingAccepted.friendsToGetAccept[existingFriendAcceptedIndex];

    userGettingAccepted.friendsToGetAccept =
      userGettingAccepted.friendsToGetAccept.filter(
        (friend, index) => index !== existingFriendGettingaccepted
      );

    user.friends.push(existingFriend);
    userGettingAccepted.friends.push(existingFriendGettingaccepted);

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

module.exports = {
  getFriends,
  addFriends,
  acceptFriend,
};
