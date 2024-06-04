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
    const existingFriend = user.friendsToGetAccepted.find(
      (friendsToGetAccepted) => friendsToGetAccepted.email === email
    );

    const existingFriendToAdd = usertoAdd.friendsToAccept.find(
      (friendsToAccept) => friendsToAccept.email === userEmail
    );

    if (existingFriend || existingFriendToAdd) {
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
  const { email } = req.body;
  const { acceptingUserEmail } = req.params;

  try {
    const user = await Friends.findOne({ email: acceptingUserEmail });
    const userGettingAccepted = await Friends.findOne({ email: email });



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

module.exports = {
  getFriends,
  addFriends,
  acceptFriend,
};
