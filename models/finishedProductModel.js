let mongoose = require('mongoose');

const finishedProductSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
    price: { type: Number, default: 0 }
}, {
    timestamps: true
});

module.exports = mongoose.model('FinishedProduct', finishedProductSchema);