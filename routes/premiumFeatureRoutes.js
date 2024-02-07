const express = require('express');

const premiumFeatureController = require('../controllers/premiumFeatureController');

const authenticatemiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/showLeaderBoard', authenticatemiddleware.authenticate,premiumFeatureController.getUserLeaderBoard);


module.exports = router;