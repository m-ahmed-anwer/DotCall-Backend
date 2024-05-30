const express = require("express");
const {
  registerUser,
  loginUser,
  resetPassword,
  checkUserByEmail,
  checkUserByUsernameToChangePassword,
  checkUserByUsername,
  editProfile,
  editGeneralSettings,
  getAllRegisteredUsers,
  changeVerification,
} = require("../controllers/userController");
const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/resetPassword", resetPassword);
router.post("/email", checkUserByEmail);
router.post("/passwordChange", checkUserByUsernameToChangePassword);
router.post("/username:username", checkUserByUsername);
router.post("/editProfile/:userId", editProfile);
router.post("/editGeneralSettings/:userId", editGeneralSettings);
router.get("/getAllRegisteredUsers/:userInput", getAllRegisteredUsers);
router.post("/changeVerification/:userEmail", changeVerification);

module.exports = router;
