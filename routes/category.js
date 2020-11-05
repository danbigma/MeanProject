const express = require("express");
const controller = require("../controllers/category");
const router = express.Router();

//localhost:5000/api/category
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.patch("/:id", controller.update);
router.delete("/:id", controller.remove);


module.exports = router;