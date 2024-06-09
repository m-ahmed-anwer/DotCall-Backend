const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/userModel.js");
const Friends = require("../models/friendModel.js");
const generateAuthToken = require("../config/generateToke.js");

const registerUser = async (req, res) => {
  const { name, email, password, username } = req.body;

  try {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res
        .status(400)
        .json({ success: false, message: "Username already exists" });
    }

    const user = await User.create({
      name,
      username,
      email,
      password,
    });

    await Friends.create({
      name,
      email,
      username,
      friends: [],
    });

    if (user) {
      res.json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          username: user.username,
          createdAt: user.createdAt,
          isVerified: user.isVerified,
          generalSettings: {
            notification: user.generalSettings.notification,
            faceId: user.generalSettings.faceId,
            haptic: user.generalSettings.haptic,
          },
        },
      });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No user found on this email",
      });
    }

    const auth = await bcrypt.compare(password, user.password);

    if (!auth) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }

    user.isVerified = true;
    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
        generalSettings: {
          notification: user.generalSettings.notification,
          faceId: user.generalSettings.faceId,
          haptic: user.generalSettings.haptic,
        },
        token: generateAuthToken(user._id),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const changeVerification = async (req, res) => {
  const { userEmail } = req.params;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No user found on this email",
      });
    }

    user.isVerified = true;
    res.json({
      success: true,
      message: "Verification Update changed",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const checkUserByEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        success: false,
        message:
          "A User found on this email, Try using by a different email address",
      });
    }

    res.json({
      success: true,
      message: "Account can be created",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const checkUserByUsername = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });

    if (user) {
      return res.status(400).json({
        success: false,
        message:
          "Try using a different username, A user already registered under this username",
      });
    }

    res.json({
      success: true,
      message: "Account can be created with this username",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const editProfile = async (req, res) => {
  const { name } = req.body;
  const { userId } = req.params; // Assuming userId is passed as a route parameter

  try {
    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update the user's name and email
    user.name = name;
    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const editGeneralSettings = async (req, res) => {
  const { notification, faceId, haptic } = req.body;
  const { userId } = req.params;

  try {
    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update the user's generalSettings if they are different
    if (notification !== undefined)
      user.generalSettings.notification = notification;
    if (faceId !== undefined) user.generalSettings.faceId = faceId;
    if (haptic !== undefined) user.generalSettings.haptic = haptic;

    await user.save();

    res.json({
      success: true,
      message: "General settings updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
        generalSettings: {
          notification: user.generalSettings.notification,
          faceId: user.generalSettings.faceId,
          haptic: user.generalSettings.haptic,
        },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  resetPassword,
  checkUserByEmail,
  checkUserByUsername,
  editProfile,
  editGeneralSettings,
  changeVerification,
};
