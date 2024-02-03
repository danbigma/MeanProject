const express = require('express');
const router = express.Router();

const routes = {
  '/auth': require('./auth'),
  '/analytics': require('./analytics'),
  '/category': require('./category'),
  '/order': require('./order'),
  '/position': require('./position'),
  '/users': require('./users'),
  '/warehouse': require('./warehouse'),
  '/tires': require('./tire')
  // Más rutas...
};

// Iterar sobre el objeto de rutas y aplicarlas al enrutador
for (const path in routes) {
  router.use(path, routes[path]);
}

module.exports = router;
