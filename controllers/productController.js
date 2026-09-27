let response = require("../utils/responses")
let productDB = require("../models/productModel") 

class ProductsController {

    async getProducts(req, res) {
        try {
            let allProducts = await productDB.find()
            if (!allProducts.length) return response.notFound(res, "Mahsulotlar hozircha yo'q")
            return response.success(res, "hamma mahsulotlar", allProducts)
        } catch (err) {
            response.serverError(res, err.message, err)
        }
    }

    async getProductById(req, res) {
        try {
            let { id } = req.params
            let product = await productDB.findById(id)
            if (!product) return response.notFound(res, "Mahsulot topilmadi")
            return response.success(res, "mahsulot topildi", product)
        } catch (err) {
            response.serverError(res, err.message, err)
        }
    }

    async addProduct(req, res) {
        try {
            let body = req.body
            let newProduct = await productDB.create(body)

            return response.created(res, "mahsulot qo'shildi", newProduct)
        } catch (err) {
            response.serverError(res, err.message, err)
        }
    }

    async updateProduct(req, res) {
        try {
            let { id } = req.params
            let updates = req.body

            let updatedProduct = await productDB.findByIdAndUpdate(
                id,
                updates,
                { new: true, runValidators: true }
            )

            if (!updatedProduct) return response.notFound(res, "Mahsulot topilmadi")

            return response.success(res, "mahsulot ma'lumotlari yangilandi", updatedProduct)
        } catch (err) {
            response.serverError(res, err.message, err)
        }
    }

    async deleteProduct(req, res) {
        try {
            let { id } = req.params
            let deletedProduct = await productDB.findByIdAndDelete(id)

            if (!deletedProduct) return response.notFound(res, "Mahsulot topilmadi")

            return response.success(res, "mahsulot o'chirildi", null)
        } catch (err) {
            response.serverError(res, err.message, err)
        }
    }
}

module.exports = new ProductsController()