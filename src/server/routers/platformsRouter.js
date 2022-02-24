const express = require("express");
const {
  getPlatforms,
  createPlatform,
} = require("../controllers/platformController");

const router = express.Router();

router.get("/", getPlatforms);
router.post("/", createPlatform);

module.exports = router;
