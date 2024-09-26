const express = require('express');
const router = express.Router();
const passport = require("passport");
const controller = require('../controllers/stock');
const checkRoles = require('../utils/checkRol');
const upload = require("../middleware/upload");

// Aplicar autenticación JWT a todas las rutas
router.use(passport.authenticate("jwt", { session: false }));

router.get('/', checkRoles(['ADMIN']), controller.getAll);
router.get('/:id', checkRoles(['ADMIN']), controller.getById);
router.post('/', checkRoles(['ADMIN']), upload.single("image"), controller.create);
router.put('/:id', checkRoles(['ADMIN']), upload.single("image"), controller.update);
router.delete('/:id', checkRoles(['ADMIN']), controller.delete);

module.exports = router;