let mongoose = require('mongoose')

const normSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    materials: [
        {
            materialName: { type: String, required: true },
            quantityPerUnit: { type: Number, required: true },
            unit: { type: String, required: true }
        }
    ]
})      

module.exports = mongoose.model('Norm', normSchema)