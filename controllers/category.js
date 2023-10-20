const Category = require("../models/Category");
const Position = require("../models/Position");
const errorHandler = require("../utils/errorHandler");

const HTTP_STATUS_OK = 200;
const HTTP_STATUS_CREATED = 201;
const HTTP_STATUS_NOT_FOUND = 404;

const handleErrors = async (res, func) => {
  try {
    await func();
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.getAll = async function (req, res) {
  handleErrors(res, async () => {
    const categories = await Category.find({ user: req.user.id });
    res.status(HTTP_STATUS_OK).json(categories);
  });
};

module.exports.getById = async function (req, res) {
  handleErrors(res, async () => {
    const category = await Category.findById(req.params.id);
    if (!category) {
      res.status(HTTP_STATUS_NOT_FOUND).json({ message: "Categoría no encontrada." });
    } else {
      res.status(HTTP_STATUS_OK).json(category);
    }
  });
};

module.exports.remove = async function (req, res) {
  handleErrors(res, async () => {
    await Category.remove({ _id: req.params.id });
    await Position.remove({ category: req.params.id });
    res.status(HTTP_STATUS_OK).json({
      message: "Categoría eliminada.",
    });
  });
};

module.exports.create = async function (req, res) {
  const category = new Category({
    name: req.body.name,
    user: req.user.id,
    imageSrc: req.file ? req.file.path : "",
  });

  handleErrors(res, async () => {
    await category.save();
    res.status(HTTP_STATUS_CREATED).json(category);
  });
};

module.exports.update = async function (req, res) {
  const updated = {
    name: req.body.name,
  };

  if (req.file) {
    updated.imageSrc = req.file.path;
  }

  handleErrors(res, async () => {
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id },
      { $set: updated },
      { new: true }
    );
    res.status(HTTP_STATUS_OK).json(category);
  });
};
