require("dotenv").config();
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const mongoose = require("mongoose");
const User = mongoose.model("users");

// Verifica que la clave secreta JWT esté definida
if (!process.env.JWT) {
  throw new Error("La clave secreta JWT no está definida en .env");
}

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT, // Cambia a JWT para mayor claridad
};

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(options, async (payload, done) => {
      try {
        // Busca el usuario por ID y selecciona campos específicos
        const user = await User.findById(payload.userId).select("email id");
        if (user) {
          done(null, user);
        } else {
          done(null, false); // No se encontró el usuario
        }
      } catch (error) {
        console.error("Error en la estrategia JWT:", error);
        done(error, false);
      }
    })
  );
};
