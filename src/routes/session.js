const express = require("express");
const router = express.Router();

const {
  createSession,
  deleteSession,
  getAllSessions,
  updateSession,
  getSession,
} = require("../controllers/session");

router
  .route("/")
  .post(createSession)
  .get(getAllSessions);

router
  .route("/:id")
  .get(getSession)
  .patch(updateSession)
  .delete(deleteSession);

module.exports = router;
