const Warehouse = require('../models/Warehouse');

module.exports.getAll = async (req, res) => {
  try {
    const warehouses = await Warehouse.find();
    res.json(warehouses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getById = async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) return res.status(404).send('Warehouse not found');
    res.json(warehouse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.create = async (req, res) => {
  const warehouse = new Warehouse(req.body);
  console.log(req.body);
  try {
    const newWarehouse = await warehouse.save();
    res.status(201).json(newWarehouse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports.update = async (req, res) => {
  try {
    const updatedWarehouse = await Warehouse.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedWarehouse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports.delete = async (req, res) => {
  try {
    const warehouse = await Warehouse.findByIdAndDelete(req.params.id);
    if (!warehouse) return res.status(404).send('Warehouse not found');
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
