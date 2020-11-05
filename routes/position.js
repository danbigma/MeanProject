const express = require("express");
const controller = require("../controllers/position");
const router = express.Router();

//localhost:5000/api/analytics/overview
router.get("/:categoryId", controller.getByCategoryId);
router.get("/", controller.create);
router.patch("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;

