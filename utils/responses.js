class Response {
    async success(res, message = "", data = null) {
        res.status(200).json({
            success: true,
            message: message,
            data: data
        })
    }

    async created(res, message = "malumot yaratildi", data = null) {
        res.status(201).json({
            success: true,
            message: message,
            data: data
        })
    }


    async error(res, message = "Xatolik", data = null) {
        res.status(400).json({
            success: false,
            message: message,
            data: data
        })
    }

    async notFound(res, message = "topilmadi", data = null) {
        res.status(404).json({
            success: false,
            message: message,
            data: data
        })
    }

    async serverError(res, message = "Serverda xatolik", data = null) {
        res.status(500).json({
            success: false,
            message: message,
            data: data
        })
    }
}

module.exports = new Response