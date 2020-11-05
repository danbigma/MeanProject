const express = require("express");
const controller = require("../controllers/category");
const router = express.Router();

//localhost:5000/api/analytics/overview
router.get("/", controller.getAll);

module.exports = router;