const express = require("express");
const controllers = require("../controllers/order")
const router = express.Router();

//localhost:5000/api/analytics/overview
router.get("/", controllers.getAll);
router.post("/", controllers.create);

module.exports = router;