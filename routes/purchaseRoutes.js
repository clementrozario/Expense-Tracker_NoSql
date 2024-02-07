const express = require('express');

const purchaseController = require('../controllers/purchaseController');

const authenticatemiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/premiummembership', authenticatemiddleware.authenticate,purchaseController.purchasepremium);

router.post('/updatetransactionstatus', authenticatemiddleware.authenticate, purchaseController.updateTransactionStatus)

module.exports = router;