let saleDB = require('../models/saleModel');
let finishedProductDB = require('../models/finishedProductModel');
let response = require('../utils/responses');

class SaleController {
    async getSales(req, res) {
        try {
            let sales = await saleDB.find().populate("product").sort({ createdAt: -1 });
            return response.success(res, "Sotuvlar tarixi", sales);
        } catch (err) {
            return response.serverError(res, err.message, err);
        }
    }

    async createSale(req, res) {
        try {
            let { customerName, phone, address, productName, quantity, totalPrice, paidAmount } = req.body;

            let product = await finishedProductDB.findOne({ productName });
            if (!product) {
                return response.notFound(res, "Bunday tayyor mahsulot topilmadi!");
            }

            if (product.quantity < quantity) {
                return response.serverError(res, `Omborda yetarli mahsulot yo'q! Mavjud: ${product.quantity}`);
            }

            let debt = Number(totalPrice) - Number(paidAmount || 0);

            let newSale = await saleDB.create({
                customerName,
                phone,
                address,
                product: product._id,
                productName,
                quantity,
                totalPrice,
                paidAmount: paidAmount || 0,
                debt: debt > 0 ? debt : 0
            });

            product.quantity -= Number(quantity);
            await product.save();

            return response.created(res, "Sotuv muvaffaqiyatli amalga oshirildi", newSale);
        } catch (err) {
            return response.serverError(res, err.message, err);
        }
    }

    async getCustomers(req, res) {
        try {
            let sales = await saleDB.find().populate("product").sort({ createdAt: -1 });

            if (!sales || sales.length === 0) {
                return response.success(res, "Mijozlar topilmadi", []);
            }

            let customerMap = {};
            sales.forEach(sale => {
                let key = sale.phone || sale.customerName || 'unknown';

                if (!customerMap[key]) {
                    customerMap[key] = {
                        customerName: sale.customerName || 'Noma\'lum',
                        phone: sale.phone || '-',
                        address: sale.address || '',
                        totalSpent: 0,
                        totalDebt: 0,
                        purchasesCount: 0,
                        history: []
                    };
                }

                customerMap[key].totalSpent += Number(sale.totalPrice || 0);
                customerMap[key].totalDebt += Number(sale.debt || 0);
                customerMap[key].purchasesCount += Number(sale.quantity || 1);
                customerMap[key].history.push(sale);
            });

            let customers = Object.values(customerMap);
            return response.success(res, "Mijozlar ro'yxati", customers);
        } catch (err) {
            console.error("getCustomers error:", err);
            return response.serverError(res, err.message, err);
        }
    }

    async payDebt(req, res) {
        try {
            const { saleId } = req.params;
            const { amountPaid, paymentType } = req.body;

            const amount = Number(amountPaid);

            let sale = await saleDB.findById(saleId);
            if (!sale) {
                return res.status(404).json({ success: false, message: "Sotuv topilmadi!" });
            }

            if (amount > sale.debt) {
                return res.status(400).json({ success: false, message: "Kiritilgan summa qarzdan ko'p!" });
            }

            sale.paidAmount += amount;
            sale.debt -= amount;

            if (!sale.paymentHistory) sale.paymentHistory = [];

            sale.paymentHistory.push({
                amount: amount,
                paymentType: paymentType || 'naqx',
                date: new Date()
            });

            await sale.save();

            return res.status(200).json({ success: true, message: "Qarz muvaffaqiyatli to'landi", data: sale });
        } catch (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
    }
}

module.exports = new SaleController();