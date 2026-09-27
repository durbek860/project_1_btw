let mongoose = require('mongoose')

const EmployeeSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    firstname: { type: String, required: true },
    role: {type: String, required: true},
    alloweds: {type: String, required: true},
    salary: {type: Number, required: true},
    lastname: { type: String }
})

module.exports = mongoose.model('Employee', EmployeeSchema)