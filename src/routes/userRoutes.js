const express = require("express");
const {
  registerUser,
  loginUser,
  resetPassword,
  checkUserByEmail,
  checkUserByPhoneNumberToChangePassword,
  checkUserByPhoneNumber,
  editProfile,
  editGeneralSettings,
} = require("../controllers/userController");
const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/resetPassword", resetPassword);
router.post("/email", checkUserByEmail);
router.post("/passwordChange", checkUserByPhoneNumberToChangePassword);
router.post("/phoneNumber", checkUserByPhoneNumber);
router.post("/editProfile/:userId", editProfile);
router.post("/editGeneralSettings/:userId", editGeneralSettings);

module.exports = router;
