const express = require("express");
const passport = require("passport");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const routes = require("./routes/index");
const connectDB = require("./database/mongoose");

const app = express();

// Conectar a la base de datos de forma asincrónica
connectDB().catch((error) =>
  console.error("Error connecting to MongoDB", error)
);

// Mejoras de seguridad con Helmet
app.use(helmet());

// Reemplazar body-parser con funcionalidades integradas de Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Personalizar o eliminar el encabezado X-Powered-By por seguridad
app.disable("x-powered-by");

// Inicializar Passport para autenticación
app.use(passport.initialize());
require("./middleware/passport")(passport);

// Logger para desarrollo
app.use(morgan("dev"));

// Servir archivos estáticos desde la carpeta 'uploads'
app.use("/uploads", express.static("uploads"));

// Habilitar CORS para todas las rutas
app.use(cors());

// Definir rutas de la API
app.use("/api", routes);

module.exports = app;
