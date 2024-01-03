const Category = require("../models/Category");
const Position = require("../models/Position");
const errorHandler = require("../utils/errorHandler");

const HTTP_STATUS_OK = 200;
const HTTP_STATUS_CREATED = 201;
const HTTP_STATUS_NOT_FOUND = 404;

const handleErrors = (func) => async (req, res) => {
  try {
    await func(req, res);
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.getAll = handleErrors(async (req, res) => {
  const categories = await Category.find({ user: req.user.id });
  res.status(HTTP_STATUS_OK).json(categories);
});

module.exports.getById = handleErrors(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res
      .status(HTTP_STATUS_NOT_FOUND)
      .json({ message: "Categoría no encontrada." });
  }
  res.status(HTTP_STATUS_OK).json(category);
});

module.exports.remove = handleErrors(async (req, res) => {
  await Category.remove({ _id: req.params.id });
  await Position.remove({ category: req.params.id });
  res.status(HTTP_STATUS_OK).json({ message: "Categoría eliminada." });
});

module.exports.create = handleErrors(async (req, res) => {
  const category = new Category({
    name: req.body.name,
    user: req.user.id,
    imageSrc: req.file ? req.file.path : "",
  });

  await category.save();
  res.status(HTTP_STATUS_CREATED).json(category);
});

module.exports.update = handleErrors(async (req, res) => {
  const updated = { name: req.body.name };
  if (req.file) {
    updated.imageSrc = req.file.path;
  }

  const category = await Category.findOneAndUpdate(
    { _id: req.params.id },
    { $set: updated },
    { new: true }
  );
  res.status(HTTP_STATUS_OK).json(category);
});
