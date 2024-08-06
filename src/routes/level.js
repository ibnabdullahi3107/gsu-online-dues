const express = require("express");
const router = express.Router();

const {
  createLevel,
  deleteLevel,
  getAllLevels,
  updateLevel,
  getLevel,
} = require("../controllers/Level");

router.route("/").post(createLevel).get(getAllLevels);

router.route("/:id").get(getLevel).patch(updateLevel).delete(deleteLevel);

module.exports = router;
