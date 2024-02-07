const express = require('express');
const expenseController = require('../controllers/expenseController');
const userauthentication = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/addexpense', userauthentication.authenticate, expenseController.addexpense);
router.get('/getexpenses', userauthentication.authenticate, expenseController.getexpenses);
router.delete('/deleteexpense/:expenseid', userauthentication.authenticate, expenseController.deleteexpense);

module.exports = router;
