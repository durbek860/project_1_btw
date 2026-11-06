let response = require("../utils/responses")
let finishedProductDB = require("../models/finishedProductModel")
let productDB = require("../models/productModel")
let Norm = require("../models/normModel")

class FinishedProductsController {

    async getFinishedProducts(req, res) {
        try {
            let allProducts = await finishedProductDB.find().sort({ createdAt: -1 })
            return response.success(res, "hamma tayyor mahsulotlar", allProducts)
        } catch (err) {
            response.serverError(res, err.message, err)
        }
    }

    async getFinishedProductById(req, res) {
        try {
            let { id } = req.params
            let product = await finishedProductDB.findById(id)
            if (!product) return response.notFound(res, "Tayyor mahsulot topilmadi")
            return response.success(res, "tayyor mahsulot topildi", product)
        } catch (err) {
            response.serverError(res, err.message, err)
        }
    }

    async addFinishedProduct(req, res) {
        try {
            let { productName, quantity, unit, price } = req.body

            let norm = await Norm.findOne({ productName })
            if (!norm) {
                return response.notFound(res, "Bu mahsulot uchun normativ (resept) topilmadi!")
            }

            let multiplier = Number(quantity) / (norm.quantity || 1)

            for (let mat of norm.materials) {
                let productItem = await productDB.findOne({
                    $or: [{ name: mat.materialName }, { productName: mat.materialName }]
                })

                if (!productItem) {
                    return response.notFound(res, `Omborda "${mat.materialName}" topilmadi!`)
                }

                let requiredAmount = mat.quantityPerUnit * multiplier
                if (productItem.quantity < requiredAmount) {
                    return response.serverError(res, `Omborda "${mat.materialName}" yetarli emas! Kerak: ${requiredAmount}, Mavjud: ${productItem.quantity}`)
                }
            }

            for (let mat of norm.materials) {
                let requiredAmount = mat.quantityPerUnit * multiplier
                await productDB.findOneAndUpdate(
                    { $or: [{ name: mat.materialName }, { productName: mat.materialName }] },
                    { $inc: { quantity: -requiredAmount } }
                )
            }

            let existingFinished = await finishedProductDB.findOne({ productName })
            let savedProduct

            if (existingFinished) {
                existingFinished.quantity += Number(quantity)
                if (price) existingFinished.price = price
                savedProduct = await existingFinished.save()
            } else {
                savedProduct = await finishedProductDB.create({
                    productName,
                    quantity,
                    unit,
                    price: price || 0
                })
            }

            return response.created(res, "Tayyor mahsulot yaratildi va xomashyolar ombordan ayrildi", savedProduct)
        } catch (err) {
            response.serverError(res, err.message, err)
        }
    }

    async updateFinishedProduct(req, res) {
        try {
            let { id } = req.params
            let updates = req.body

            let updatedProduct = await finishedProductDB.findByIdAndUpdate(
                id,
                updates,
                { new: true, runValidators: true }
            )

            if (!updatedProduct) return response.notFound(res, "Tayyor mahsulot topilmadi")

            return response.success(res, "tayyor mahsulot ma'lumotlari yangilandi", updatedProduct)
        } catch (err) {
            response.serverError(res, err.message, err)
        }
    }

    async deleteFinishedProduct(req, res) {
        try {
            let { id } = req.params
            let deletedProduct = await finishedProductDB.findByIdAndDelete(id)

            if (!deletedProduct) return response.notFound(res, "Tayyor mahsulot topilmadi")

            return response.success(res, "tayyor mahsulot o'chirildi", null)
        } catch (err) {
            response.serverError(res, err.message, err)
        }
    }
}

module.exports = new FinishedProductsController()