const Category = require("../models/Category");
const Position = require("../models/Position");
const errorHandler = require("../utils/errorHandler");

module.exports.getAll = async function (req, res) {
    try {
        const categories = Category.find({ 
            user: req.user.id
        });
        res.status(200).json(categories);
    } catch (e) {
        errorHandler(res, e);
    }
};

module.exports.getById = async function (req, res) {
    try {
        const category = Category.findById({category: req.params.id});
        res.status(200).json(category);
    } catch (e) {
        errorHandler(res, e);
    }
};

module.exports.remove = async function (req, res) {
    try {
        await Category.remove({_id: req.params.id});
        await Position.remove({category: req.params.id});
        res.status(200).json({
            message: "Позиция была удалена."
        });
    } catch (e) {
        errorHandler(res, e); 
    }
};

module.exports.create = async function (req, res) {
    try {
        const category = Category.find({
            category: req.params.categoryId,
            user: req.user.id
        });
        res.status(200).json(category);
    } catch (e) {
        errorHandler(res, e);
    }
};

module.exports.update = async function (req, res) {
    try {
        const category = Category.find({
            category: req.params.categoryId,
            user: req.user.id
        });
        res.status(200).json(category);
    } catch (e) {
        errorHandler(res, e);
    }
};

