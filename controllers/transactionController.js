const transactionDB = require("../models/transactionModel")
const mongoose = require("mongoose")
const response = require("../utils/responses")

class TransactionController {

    async getTransactions(req, res) {
        try {
            let everyTransactions = await transactionDB.find()

            if (!everyTransactions.length) return response.notFound(res, "xozircha transacti ons yo'q")

            return response.success(res, "hamma transaction", everyTransactions)
        } catch (err) {
            response.serverError(res, err.message, err)
        }
    }

    async addTransactions(req, res) {
        try {
            let body = JSON.parse(JSON.stringify(req.body));

            let newTransaction = await transactionDB.create(body)

            return response.created(res, "transaction yaratldi", newTransaction)
        } catch (err) {
            response.serverError(res, err.message, err)
        }
    }

    async changeTransactions(req, res) {
        try {
            const { id } = req.params;
            let body = JSON.parse(JSON.stringify(req.body));

            let changedTransaction = await transactionDB.findByIdAndUpdate(id, body, { new: true });

            if (!changedTransaction) return response.notFound(res, "o'zgartirish uchun transaction topilmadi")

            return response.success(res, "Transaction o'zgartirildi", changedTransaction)

        } catch (err) {
            response.serverError(res, err.message, err)
        }
    }

    async deleteTransactions(req, res) {
        try {
            const { id } = req.params;
            let deletedTransaction = await transactionDB.findByIdAndDelete(id)

            if (!deletedTransaction) return response.notFound(res, "o'chirish uchun Transaction topilmadi")

            return response.success(res, "Transaction o'chirildi", deletedTransaction)
        } catch (err) {
            response.serverError(res, err.message, err)
        }
    }

    async getFilteredTransactions(req, res) {
        try {
            const { type, startDate, endDate } = req.query;
            let filter = {};

            if (type) {
                filter.type = type;
            }

            if (startDate && endDate) {
                filter.createdAt = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                };
            }

            let everyTransactions = await transactionDB.find(filter).sort({ createdAt: -1 });

            if (!everyTransactions.length) {
                return response.success(res, "transactions topilmadi", []);
            }

            return response.success(res, "hamma transaction", everyTransactions);
        } catch (err) {
            response.serverError(res, err.message, err);
        }
    }
}

module.exports = new TransactionController;