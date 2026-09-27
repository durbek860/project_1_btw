const express = require('express');
const router = express.Router();
const TransactionController = require('./controllers/transactionController')
const userController = require('./controllers/userController')
const EmployeeController = require('./controllers/employeeController')
const ProductController = require('./controllers/productController')

router.get('/transactions/all', TransactionController.getTransactions)
router.get('/transactions/filtered', TransactionController.getFilteredTransactions)
router.post('/transactions/create', TransactionController.addTransactions)
router.put('/transactions/update/:id', TransactionController.changeTransactions)
router.delete('/transactions/delete/:id', TransactionController.deleteTransactions)

// ==================USERS=======================

router.get('/users/all', userController.getUsers)
router.post('/users/login', userController.login)
router.post('/users/create', userController.create)
router.delete('/users/delete/:id', userController.delete)
router.put('/users/update/:id', userController.update)

// ==================EMPLOYEES===================

router.get('/employees', EmployeeController.getEmployees)
router.get('/employees/:id', EmployeeController.getEmployeeById)
router.post('/employees', EmployeeController.addEmployees)
router.put('/employees/:id', EmployeeController.updateEmployee)
router.delete('/employees/:id', EmployeeController.deleteEmployee)
router.post('/employees/login', EmployeeController.login)

// ==================PRODUCTS====================

router.get('/products', ProductController.getProducts)
router.get('/products/:id', ProductController.getProductById)
router.post('/products', ProductController.addProduct)
router.put('/products/:id', ProductController.updateProduct)
router.delete('/products/:id', ProductController.deleteProduct)

module.exports = router;