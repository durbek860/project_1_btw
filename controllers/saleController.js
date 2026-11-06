let saleDB = require('../models/saleModel');
let finishedProductDB = require('../models/finishedProductModel');
let response = require('../utils/responses');

class SaleController {
    async getSales(req, res) {
        try {
            let sales = await saleDB.find().sort({ createdAt: -1 });
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
            let sales = await saleDB.find().sort({ createdAt: -1 });

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
            const { amountPaid } = req.body;

            let sale = await saleDB.findById(saleId);
            if (!sale) {
                return response.notFound(res, "Sotuv topilmadi!");
            }

            if (amountPaid > sale.debt) {
                return response.serverError(res, "To'lanayotgan summa mavjud qarzdan oshib ketdi!");
            }

            sale.paidAmount += Number(amountPaid);
            sale.debt -= Number(amountPaid);

            await sale.save();

            return response.success(res, "Qarz muvaffaqiyatli to'landi", sale);
        } catch (err) {
            return response.serverError(res, err.message, err);
        }
    }
}

module.exports = new SaleController();