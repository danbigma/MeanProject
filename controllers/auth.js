const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const User = require("../models/User");
const errorHandler = require("../utils/errorHandler");

const HTTP_STATUS_OK = 200;
const HTTP_STATUS_UNAUTHORIZED = 401;
const HTTP_STATUS_CONFLICT = 409;
const JWT_EXPIRATION_TIME = 60 * 60;

module.exports.login = async function (req, res) {
  try {
    const candidate = await User.findOne({ email: req.body.email });

    if (!candidate) {
      return res.status(HTTP_STATUS_UNAUTHORIZED).json({
        message: "Usuario con este correo no encontrado.",
      });
    }

    const isPasswordValid = bcrypt.compareSync(req.body.password, candidate.password);

    if (!isPasswordValid) {
      return res.status(HTTP_STATUS_UNAUTHORIZED).json({
        message: "Las contraseñas no coinciden.",
      });
    }

    const token = jwt.sign(
      {
        email: candidate.email,
        userId: candidate._id,
      },
      keys.jwt,
      { expiresIn: JWT_EXPIRATION_TIME }
    );

    res.status(HTTP_STATUS_OK).json({
      token: "Bearer " + token,
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

    const salt = bcrypt.genSaltSync(10);
    const password = req.body.password;
    const user = new User({
      email: req.body.email,
      password: bcrypt.hashSync(password, salt),
    });

    await user.save();

    res.status(HTTP_STATUS_OK).json(user);
  } catch (error) {
    errorHandler(res, error);
  }
};
