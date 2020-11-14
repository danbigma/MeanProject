const express = require("express");
const passport = require("passport");
const upload = require("../controllers/category");
const controller = require("../middleware/upload");

const router = express.Router();

// localhost:5000/api/category
router.get("/", passport.authenticate("jwt", { session: false }), controller.getAll);
router.get("/:id", passport.authenticate("jwt", { session: false }), controller.getById);
router.post("/", passport.authenticate("jwt", { session: false }), upload.single("image"), controller.create);
router.patch("/:id", passport.authenticate("jwt", { session: false }), upload.single("image"), controller.update);
router.delete("/:id", passport.authenticate("jwt", { session: false }), controller.remove);


module.exports = router;