const userDB = require("../models/userModel")
const bcrypt = require('bcrypt')
const Jwt = require('jsonwebtoken')

class UserController {
    async getUsers(req, res) {
        try {
            let allUsers = await userDB.find()

            if (!allUsers.length) return response.notFound(res, "Foydalanuvchi topilmadi")

            return response.success(res, "Foydalanuvchilar topildi", allUsers)
        } catch (err) {
            response.serverError(res, err.message, err)
        }
    }

    async create(req, res) {
        try {
            let body = JSON.parse(JSON.stringify(req.body));

            let salt = 15
            let saltRounds = await bcrypt.genSalt(salt)
            let hashedPassword = await bcrypt.hash(body.password, saltRounds)

            body.password = hashedPassword

            let newUser = await userDB.create(body)

            return response.created(res, "Foydalanuvchi qo'shildi", newUser)
        }
        catch (err) {
            response.serverError(res, err.message, err)
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            let deletedUser = await userDB.findByIdAndDelete(id);

            if (!deletedUser) return response.notFound(res, "Bu ID da foydalanuvchi yo'q");

            return response.success(res, "Foydalanuvchi o'chirildi")
        }
        catch (err) {
            response.serverError(res, err.message, err);
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            let body = req.body;

            if (body.password) {
                let salt = 15;
                let saltRounds = await bcrypt.genSalt(salt);
                body.password = await bcrypt.hash(body.password, saltRounds);
            }

            let updatedUser = await userDB.findByIdAndUpdate(id, body, { returnDocument: 'after' });

            if (!updatedUser) return response.notFound(res, "Yangilash uchun foydalanuvchi topilmadi");

            return response.success(res, "Foydalanuvchi yangilandi", updatedUser)
        }
        catch (err) {
            response.serverError(res, err.message, err);
        }
    }

    async login(req, res) {
        try {
            let { username, password } = req.body

            if (!username || !password) {
                return response.error(res, "Username yoki parol xato")
            }

            let exactUser = await userDB.findOne({ username: username })
            if (!exactUser) {
                return response.notFound(res, "Username yoki parol xato")
            }

            let verifyPassword = await bcrypt.compare(password, exactUser.password)
            if (!verifyPassword) {
                return response.notFound(res, "Topilmadi")
            }

            let secret_key = "d32u@!3r2b2e#43#232@22k32836"
            let token = await Jwt.sign({ username: exactUser.username }, secret_key, { expiresIn: "1w" })

            response.success(res, "Muvaffaqiyatli kirildi", { ...exactUser._doc, token })
        }
        catch (err) {
            response.serverError(res, err.message, err)
        }
    }
}

module.exports = new UserController()