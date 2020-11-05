const express = require("express");
const controllers = require("../controllers/analytics")
const router = express.Router();

//localhost:5000/api/analytics/overview
router.get("/analytics", controllers.analytics);
router.get("/overview", controllers.overview);

module.exports = router;