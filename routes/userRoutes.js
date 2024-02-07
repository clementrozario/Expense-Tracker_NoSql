const express = require('express');

const userController = require('../controllers/userController');


const expenseController = require('../controllers/expenseController')

const userauthentication = require('../middleware/authMiddleware')

const router = express.Router();


router.post('/signup', userController.signup);

router.post('/login', userController.login);

router.get('/download', userauthentication.authenticate, expenseController.downloadExpenses );

router.get('/downloadurls', userauthentication.authenticate, expenseController.downloadUrls  );

module.exports = router;