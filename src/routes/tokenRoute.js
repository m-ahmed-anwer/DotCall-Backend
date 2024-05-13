const express = require("express");
const { tokenGenerator } = require("../controllers/callController");
const router = express.Router();

router.get("/accessToken", function (request, response) {
  tokenGenerator(request, response);
});

router.post("/accessToken", function (request, response) {
  tokenGenerator(request, response);
});

module.exports = router;
