const express = require("express");
const { getPlatforms } = require("../controllers/platformController");

const router = express.Router();

router.get("/", getPlatforms);

module.exports = router;
