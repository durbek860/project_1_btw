let mongoose = require('mongoose')

const normSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    unit: { type: String, required: true },
    minStock: { type: Number, required: true },
    maxStock: { type: Number, required: true },
    laborTimePerUnit: { type: Number, required: true },
    materials: [
        {
            materialName: { type: String, required: true },
            quantityPerUnit: { type: Number, required: true },
            unit: { type: String, required: true }
        }
    ]
})

module.exports = mongoose.model('Norm', normSchema)