const express = require("express");
const router = express.router();
const mainController = require("../controllers/mainController");

router.get("/", mainController.homepage);

module.exports = router;
