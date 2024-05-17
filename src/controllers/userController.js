const bcrypt = require("bcryptjs");
const User = require("../models/userModel.js");

const registerUser = async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;
  try {
    const user = await User.create({
      name,
      phoneNumber,
      email,
      password,
      generalSettings: {
        notification,
        faceId,
        haptic,
      },
    });
    if (user) {
      res.json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          createdAt: user.createdAt,
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
  const { phoneNumber, password } = req.body;

  try {
    const user = await User.findOne({ phoneNumber });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No user found on this phone number",
      });
    }

    const auth = await bcrypt.compare(password, user.password);

    if (!auth) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
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

const resetPassword = async (req, res) => {
  const { phoneNumber, newPassword } = req.body;

  try {
    const user = await User.findOne({ phoneNumber });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Phone Number",
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

const checkUserByPhoneNumberToChangePassword = async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    const user = await User.findOne({ phoneNumber });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No account registered under this phone number",
      });
    }

    res.json({
      success: true,
      message: "Password Can be changed",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const checkUserByPhoneNumber = async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    const user = await User.findOne({ phoneNumber });

    if (user) {
      return res.status(400).json({
        success: false,
        message:
          "A user found on this phone number, Try using a different number",
      });
    }

    res.json({
      success: true,
      message: "Account can be created with this phone number",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const editProfile = async (req, res) => {
  const { email, name } = req.body;
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
    user.email = email;
    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
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
        phoneNumber: user.phoneNumber,
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
  checkUserByPhoneNumberToChangePassword,
  checkUserByPhoneNumber,
  editProfile,
  editGeneralSettings,
};
