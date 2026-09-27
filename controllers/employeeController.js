let bcrypt = require("bcrypt")
let mongoose = require("mongoose")
let jwt = require("jsonwebtoken")
let response = require("../utils/responses")
let employeeDB = require("../models/employeeModel")

class EmployeesController {

    async getEmployees(req, res) {
        try {
            let allEmployees = await employeeDB.find().select("-password")
            if (!allEmployees.length) return response.notFound(res, "Hodimlar hozircha yo'q")
            return response.success(res, "hamma hodimlar", allEmployees)
        } catch (err) {
            response.serverError(res, err.message, err)
        }
    }

    async getEmployeeById(req, res) {
        try {
            let { id } = req.params
            let employee = await employeeDB.findById(id).select("-password")
            if (!employee) return response.notFound(res, "Hodim topilmadi")
            return response.success(res, "hodim topildi", employee)
        } catch (err) {
            response.serverError(res, err.message, err)
        }
    }

    async addEmployees(req, res) {
        try {
            let body = req.body
            let newEmployee = await employeeDB.create(body)
            let employeeResponse = newEmployee.toObject()
            delete employeeResponse.password

            return response.created(res, "hodim qo'shildi", employeeResponse)
        } catch (err) {
            response.serverError(res, err.message, err)
        }
    }

    async updateEmployee(req, res) {
        try {
            let { id } = req.params
            let updates = req.body

            if (updates.password) {
                let salt = await bcrypt.genSalt(13)
                updates.password = await bcrypt.hash(updates.password, salt)
            }

            let updatedEmployee = await employeeDB.findByIdAndUpdate(
                id,
                updates,
                { new: true, runValidators: true }
            ).select("-password")

            if (!updatedEmployee) return response.notFound(res, "Hodim topilmadi")

            return response.success(res, "hodim ma'lumotlari yangilandi", updatedEmployee)
        } catch (err) {
            response.serverError(res, err.message, err)
        }
    }

    async deleteEmployee(req, res) {
        try {
            let { id } = req.params
            let deletedEmployee = await employeeDB.findByIdAndDelete(id)

            if (!deletedEmployee) return response.notFound(res, "Hodim topilmadi")

            return response.success(res, "hodim o'chirildi", null)
        } catch (err) {
            response.serverError(res, err.message, err)
        }
    }

    async login(req, res) {
        try {
            let { username, password } = req.body
            let employee = await employeeDB.findOne({ username })

            if (!employee) return response.notFound(res, "Username yoki parol xato")

            let isMatch = await bcrypt.compare(password, employee.password)
            if (!isMatch) return response.notFound(res, "Username yoki parol xato")

            let token = jwt.sign(
                { id: employee._id, role: employee.role },
                process.env.JWT_SECRET || "secret_key",
                { expiresIn: "1d" }
            )

            let employeeData = employee.toObject()
            delete employeeData.password

            return response.success(res, "Muvaffaqiyatli kirdingiz", { token, employee: employeeData })
        } catch (err) {
            response.serverError(res, err.message, err)
        }
    }
}

module.exports = new EmployeesController()