const express = require("express");
const passport = require("passport");
const upload = require("../middleware/upload");
const controller = require("../controllers/category");

const router = express.Router();

// Aplicar autenticación JWT a todas las rutas
router.use(passport.authenticate("jwt", { session: false }));

// Rutas de categoría
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", upload.single("image"), controller.create);
router.patch("/:id", upload.single("image"), controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
