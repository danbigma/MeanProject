const Tire = require("../models/Tire");

// Obtener todos los neumáticos
module.exports.getAll = async (req, res) => {
  try {
    const tires = await Tire.aggregate([
      {
        $lookup: {
          from: "warehouses", // El nombre de la colección a la que te quieres unir.
          localField: "warehouseId", // El campo en los documentos de la colección Tire que contiene el id del almacén.
          foreignField: "_id", // El campo en los documentos de la colección Warehouse que corresponde al id.
          as: "warehouseInfo" // El nombre del campo en el que se colocarán los documentos unidos.
        }
      },
      {
        $unwind: "$warehouseInfo" // Opcional: descomponer el array de warehouseInfo si siempre esperas 1 resultado.
      }
      // Puedes añadir más etapas aquí si es necesario, como $match, $project, etc.
    ]);

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
