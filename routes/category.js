const express = require("express");
const passport = require("passport");
const upload = require("../middleware/upload");
const controller = require("../controllers/category");
const checkRoles = require('../utils/checkRol');

const router = express.Router();

// Aplicar autenticación JWT a todas las rutas
router.use(passport.authenticate("jwt", { session: false }));

// Rutas de categoría
router.get("/", checkRoles(['ADMIN']), controller.getAll);
router.get("/:id", checkRoles(['ADMIN']), controller.getById);
router.post("/", checkRoles(['ADMIN']), upload.single("image"), controller.create);
router.patch("/:id", checkRoles(['ADMIN']), upload.single("image"), controller.update);
router.delete("/:id", checkRoles(['ADMIN']), controller.remove);

module.exports = router;
