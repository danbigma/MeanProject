module.exports = function checkRoles(allowedRoles) {
  return function (req, res, next) {
    const user = req.user; // Asegúrate de que el usuario está ya autenticado
    if (user && allowedRoles.includes(user.role)) {
      next();
    } else {
      res.status(403).json({ message: "Acceso denegado" });
    }
  };
};
