const Friends = require("../models/friendModel.js");

const addFriends = async (req, res) => {
  const { email, name, username } = req.body;
  const { userEmail } = req.params;

  try {
    const user = await Friends.findOne({ email: userEmail });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check if the email address already exists in the friends array
    const existingFriend = user.friendsToAccept.find(
      (friendsToAccept) => friendsToAccept.email === email
    );
    if (existingFriend) {
      return res.status(400).json({
        success: false,
        message: "Friend already Accepted",
      });
    }

    user.friendsToAccept.push({ name, email, username });

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Friend accepted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const acceptFriend = async (req, res) => {
  const { email, name, username } = req.body;
  const { userEmail } = req.params;

  try {
    const user = await Friends.findOne({ email: userEmail });

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

    user.friends.push(existingFriend);

    await user.save();

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
