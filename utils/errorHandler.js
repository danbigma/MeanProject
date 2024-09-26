const winston = require("winston");

// Configura el logger
const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "error.log" }),
  ],
});

// Función para manejar errores
module.exports = function (res, error, level = "error") {
  const statusCode = error.statusCode || 500;
  const errorMessage = error.message || "Error interno del servidor";

  // Registra el error con detalles adicionales
  logger.log({
    level,
    message: errorMessage,
    statusCode,
    stack: error.stack,
  });

  res.status(statusCode).json({
    success: false,
    error: errorMessage,
  });
};
