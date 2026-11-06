let response = require("../utils/responses")
let normDB = require("../models/normModel")

class NormController {

    async getNorms(req, res) {
        try {
            let allNorms = await normDB.find()
            if (!allNorms.length) {
                return response.success(res, "Normativlar hozircha yo'q", [])
            }
            return response.success(res, "hamma normativlar", allNorms)
        } catch (err) {
            response.serverError(res, err.message, err)
        }
    }

    async addNorm(req, res) {
        try {
            let body = req.body
            let newNorm = await normDB.create(body)

            return response.created(res, "normativ qo'shildi", newNorm)
        } catch (err) {
            response.serverError(res, err.message, err)
        }
    }

    async updateNorm(req, res) {
        try {
            let { id } = req.params
            let updates = req.body

            let updatedNorm = await normDB.findByIdAndUpdate(
                id,
                updates,
                { new: true, runValidators: true }
            )

            if (!updatedNorm) return response.notFound(res, "Normativ topilmadi")

            return response.success(res, "normativ ma'lumotlari yangilandi", updatedNorm)
        } catch (err) {
            response.serverError(res, err.message, err)
        }
    }

    async deleteNorm(req, res) {
        try {
            let { id } = req.params
            let deletedNorm = await normDB.findByIdAndDelete(id)

            if (!deletedNorm) return response.notFound(res, "Normativ topilmadi")

            return response.success(res, "normativ o'chirildi", null)
        } catch (err) {
            response.serverError(res, err.message, err)
        }
    }
}

module.exports = new NormController()
