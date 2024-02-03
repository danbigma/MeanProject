const Tire = require("../models/Tire");

// Obtener todos los neumáticos
module.exports.getAll = async (req, res) => {
  try {
    const tires = await Tire.find();
    res.json(tires);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener un neumático por ID
module.exports.getById = async (req, res) => {
  try {
    const tire = await Tire.findById(req.params.id);
    if (!tire) return res.status(404).json({ message: "Tire not found" });
    res.json(tire);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear un nuevo neumático
module.exports.create = async (req, res) => {
  const tire = new Tire(req.body);
  try {
    const newTire = await tire.save();
    res.status(201).json(newTire);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Actualizar un neumático por ID
module.exports.update = async (req, res) => {
  try {
    const updatedTire = await Tire.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedTire);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eliminar un neumático por ID
module.exports.delete = async (req, res) => {
  try {
    const tire = await Tire.findByIdAndDelete(req.params.id);
    if (!tire) return res.status(404).json({ message: "Tire not found" });
    res.json({ message: "Tire deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
