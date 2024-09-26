const express = require("express");
const passport = require("passport");
const controller = require("../controllers/auth");
const checkRoles = require('../utils/checkRol');

const router = express.Router();

// Aplicar autenticación JWT a todas las rutas
router.use(passport.authenticate("jwt", { session: false }));

// Rutas de categoría
router.get("/", checkRoles(['ADMIN']), controller.getAll);
router.get("/:id", checkRoles(['ADMIN']), controller.getById);
router.post("/", checkRoles(['ADMIN']), controller.register);
router.put('/:id', checkRoles(['ADMIN']), controller.update);

module.exports = router;
