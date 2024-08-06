const express = require("express");
const router = express.Router();

const {
  login,
  logout,
  secondFactorLogin,
} = require("../controllers/Authentication");

const {
  QRCodeProcess,
  validateQrCode,
} = require("../services/authenticationService");

const authenticate = require("../middlewares/authentication");

router.post("/login", login);
router.post("/login/2fa", secondFactorLogin);
router.get("/logout", authenticate, logout);
router.get("/2fa/generate", authenticate, QRCodeProcess);
router.post("/2fa/validate", authenticate, validateQrCode);

module.exports = router;
