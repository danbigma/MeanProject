const mongoose = require("mongoose");

const productVariantSchema = new mongoose.Schema({
  sku: { type: String, required: true, unique: true }, // Уникальный идентификатор SKU
  attributes: { type: Map, of: String }, // Ключ-значение для хранения различных атрибутов, например, размера, цвета, материала
  stock: { type: Number, default: 0 }, // Количество на складе
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Наименование товара
  category: { type: String, required: true }, // Категория, например "Диски", "Шины"
  brand: { type: String, required: true }, // Бренд
  description: { type: String, required: false }, // Описание
  variants: [productVariantSchema], // Массив вариантов товара
  purchasePrice: { type: Number, required: true },
  retailPrice: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  images: [{ type: String }],
  tags: [{ type: String }],
});

module.exports = mongoose.model("Product", productSchema);  
