const mongoose = require('mongoose');

const warehouseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: {
    country: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true }
  },
  capacity: { type: Number, required: true },
  operationalStatus: { type: String, required: true, enum: ['Active', 'Inactive', 'Under Maintenance'] },
  contactInfo: {
    phoneNumber: String,
    email: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Warehouse', warehouseSchema);
