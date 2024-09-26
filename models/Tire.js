const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tireSchema = new Schema(
  {
    brand: { type: String, required: true },
    model: { type: String, required: true },
    size: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ["Winter", "Summer", "All-Season", "Off-Road"],
    },
    manufactureDate: { type: Date, required: true },
    countryOfOrigin: { type: String, required: true },
    warehouseId: { type: Schema.Types.ObjectId, ref: "Warehouse" },
    quantityInStock: { type: Number, required: true, min: 0 },
    price: {
      amount: { type: Number, required: true },
      currency: { type: String, required: true },
    },
    imageSrc: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tire", tireSchema);
