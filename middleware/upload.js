const multer = require("multer");
const moment = require("moment");

const DATE_FORMAT = "DDMMYYYY-HHmmss_SSS";
const ALLOWED_TYPES = ["image/png", "image/jpeg"]; // Tipos de archivos permitidos
const MAX_SIZE = 1024 * 1024 * 5; // Tamaño máximo del archivo en bytes (5MB)

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/"); // Directorio de destino para archivos subidos
  },
  filename(req, file, cb) {
    const date = moment().format(DATE_FORMAT); // Obtener la fecha y hora actual
    cb(null, `${date}-${file.originalname}`); // Formatear el nombre del archivo
  },
});

const fileFilter = (req, file, cb) => {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true); // Aceptar archivo
  } else {
    cb(new Error("Tipo de archivo no soportado"), false); // Rechazar archivo
  }
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE },
});
