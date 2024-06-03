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
    const existingFriend = user.friends.find(
      (friend) => friend.email === email
    );
    if (existingFriend) {
      return res.status(400).json({
        success: false,
        message: "Friend already Added",
      });
    }

    user.friends.push({ name, email, username });

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

    // Exclude the user specified in req.body.email
    const friends = await Friends.find({ email: { $ne: req.body.email } });

    res.status(200).json({ success: true, friends });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getFriends,
  addFriends,
};
