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
    });
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        createdAt: user.createdAt,
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

module.exports = {
  registerUser,
  loginUser,
  resetPassword,
  checkUserByEmail,
  checkUserByPhoneNumberToChangePassword,
  checkUserByPhoneNumber,
};
