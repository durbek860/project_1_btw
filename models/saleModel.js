const { Schema, model } = require('mongoose');

const saleSchema = new Schema({
    customerName: { type: String, required: true },     
    phone: { type: String, required: true },          
    address: { type: String },                        
    quantity: { type: Number, required: true },       
    totalPrice: { type: Number, required: true },     
    paidAmount: { type: Number, default: 0 },         
    debt: { type: Number, default: 0 },               
}, { timestamps: true });

module.exports = model('Sale', saleSchema);