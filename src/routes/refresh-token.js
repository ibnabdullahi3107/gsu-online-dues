const express = require("express");
const router = express.Router();

const { refreshToken } = require("../controllers/Authentication");

router.route("/refresh-token").post(refreshToken);

module.exports = router;
