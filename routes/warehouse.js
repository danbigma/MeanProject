const express = require('express');
const router = express.Router();
const controller = require('../controllers/warehouse');
const checkRoles = require('../utils/checkRol');
const passport = require("passport");

// Aplicar autenticación JWT a todas las rutas
router.use(passport.authenticate("jwt", { session: false }));

router.get('/', checkRoles(['ADMIN']), controller.getAll);
router.get('/:id', checkRoles(['ADMIN']), controller.getById);
router.post('/', checkRoles(['ADMIN']), controller.create);
router.put('/:id', checkRoles(['ADMIN']), controller.update);
router.delete('/:id', checkRoles(['ADMIN']), controller.delete);

module.exports = router;
