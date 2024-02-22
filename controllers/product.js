const Product = require("../models/Product");

// Создание нового товара
exports.createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports.getAll = async (req, res) => {
  try {
    const products = await Product.find();
    if (!products)
      return res.status(404).json({ message: "Products not found" });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Обновление существующего товара
exports.updateProduct = async (req, res) => {
  const { productId } = req.params; // Получаем ID товара из параметров маршрута
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      req.body,
      { new: true }
    );
    // new: true гарантирует, что возвращается обновленный документ
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Добавление варианта к существующему товару
exports.addVariant = async (req, res) => {
  const { productId, variant } = req.body; // variant содержит SKU, attributes и stock
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    product.variants.push(variant);
    await product.save();
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports.getVariantById = async (req, res) => {
  try {
    // Find the product by its ID
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    // Extract the variant from the product's variants array
    const variant = product.variants.find(
      (variant) => variant._id.toString() === req.params.variantId
    );
    if (!variant) {
      return res.status(404).json({ message: "Variant not found" });
    }
    // Respond with the found variant
    res.json(variant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Обновление специфических атрибутов варианта
exports.updateVariant = async (req, res) => {
  const { variantId, attributes } = req.body; // attributes содержит обновленные значения атрибутов
  try {
    const product = await Product.findOne({ "variants._id": variantId });
    if (!product) {
      return res.status(404).json({ message: "Variant not found" });
    }

    const variant = product.variants.id(variantId);
    variant.attributes = { ...variant.attributes, ...attributes }; // Обновляем атрибуты варианта
    await product.save();
    res.status(200).json(variant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Удаление варианта из товара
exports.deleteVariant = async (req, res) => {
  const { productId, variantId } = req.params;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    product.variants.pull({ _id: variantId }); // Удаляем вариант по его ID
    await product.save();
    res.status(200).json({ message: "Variant deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
