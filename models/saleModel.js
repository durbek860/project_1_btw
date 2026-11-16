const { Schema, model, Types, default: mongoose } = require('mongoose');

const saleSchema = new Schema({
    customerName: { type: String, required: true },     
    phone: { type: String, required: true },          
    address: { type: String },
    product: { type: mongoose.Schema.Types.ObjectId, ref:"FinishedProduct" },
    quantity: { type: Number, required: true },       
    totalPrice: { type: Number, required: true },     
    paidAmount: { type: Number, default: 0 },         
    debt: { type: Number, default: 0 },
    paymentHistory: [
        {
            amount: {
                type: Number,
                required: true
            },
            paymentType: {
                type: String,
                required: true
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ] 
}, { timestamps: true });

module.exports = model('Sale', saleSchema);