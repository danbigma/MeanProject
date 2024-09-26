const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const errorHandler = require("../utils/errorHandler");

const HTTP_STATUS_OK = 200;
const HTTP_STATUS_UNAUTHORIZED = 401;
const HTTP_STATUS_CONFLICT = 409;
const JWT_EXPIRATION_TIME_DEFAULT = "1h"; // Modificado para mejorar la legibilidad
const BCRYPT_SALT_ROUNDS = 10; // Número de rondas para el salt de bcrypt

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 2 * 60 * 60 * 1000; // 2 horas

module.exports.login = async function (req, res) {
  try {
    const candidate = await User.findOne({ email: req.body.email }).select(
      "+password"
    );

    if (!candidate) {
      return res.status(HTTP_STATUS_UNAUTHORIZED).json({
        message: "Usuario con este correo no encontrado.",
      });
    }

    // Desbloqueo Automático
    if (candidate.isLocked) {
      // Verificar si el tiempo de bloqueo ha expirado
      if (Date.now() > candidate.lockUntil) {
        // Resetear estado de bloqueo y intentos
        candidate.loginAttempts = 0;
        candidate.lockUntil = undefined;
        await candidate.save();
      } else {
        return res.status(HTTP_STATUS_UNAUTHORIZED).json({
          message: "Cuenta bloqueada. Inténtalo de nuevo más tarde.",
        });
      }
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      candidate.password
    );

    if (!isPasswordValid) {
      candidate.loginAttempts += 1;
      if (candidate.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        candidate.lockUntil = Date.now() + LOCK_TIME;
      }
      await candidate.save();
      return res.status(HTTP_STATUS_UNAUTHORIZED).json({
        message: "Las contraseñas no coinciden.",
      });
    }

    // Restablecer los intentos de login después de un login exitoso
    candidate.loginAttempts = 0;
    candidate.lockUntil = undefined;

    candidate.timeLogin = Date.now();

    await candidate.save();

    const token = jwt.sign(
      {
        email: candidate.email,
        userId: candidate._id,
      },
      process.env.JWT,
      { expiresIn: process.env.JWT_EXPIRATION_TIME || JWT_EXPIRATION_TIME_DEFAULT }
    );

    const currentUser = {
      email: candidate.email,
      timeLogin: candidate.timeLogin,
      role: candidate.role,
      sessionExpiresAt: null, // Inicialmente nulo, lo calcularemos a continuación
    };
    
    // Calcular la hora de expiración de la sesión utilizando process.env.JWT_EXPIRATION_TIME
    const currentTime = new Date();

    // Obtener el tiempo de expiración del entorno y convertirlo a milisegundos
    const jwtExpirationTimeInMinutes = parseInt(process.env.JWT_EXPIRATION_TIME || "60", 10); // Fallback to 60 minutes if not defined
    const expirationTimeInMilliseconds = jwtExpirationTimeInMinutes * 60 * 1000;

    const expirationTime = new Date(currentTime.getTime() + expirationTimeInMilliseconds);

    // Guardar la hora de expiración en el objeto 'currentUser'
    currentUser.sessionExpiresAt = expirationTime;

    res.status(HTTP_STATUS_OK).json({
      token: `Bearer ${token}`,
      currentUser: currentUser,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.register = async function (req, res) {
  try {
    const candidate = await User.findOne({ email: req.body.email });

    if (candidate) {
      return res.status(HTTP_STATUS_CONFLICT).json({
        message: "¡El correo ya existe!",
      });
    }

    const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
    const password = req.body.password;
    const user = new User({
      email: req.body.email,
      role: req.body.role,
      password: await bcrypt.hash(password, salt),
    });

    await user.save();

    // Devolver solo información relevante y no sensible
    res.status(HTTP_STATUS_OK).json({ email: user.email, id: user._id, role: user.role });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.update = async (req, res) => {
  try {
    console.log(req.body);
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports.getAll = async (req, res) => {
  try {
    const users = await User.find();
    res.status(HTTP_STATUS_OK).json(users);
  } catch (error) {
    errorHandler(res, error);
  }
}

module.exports.getById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('User not found');
    res.status(HTTP_STATUS_OK).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
    // errorHandler(res, error);
  }
};
