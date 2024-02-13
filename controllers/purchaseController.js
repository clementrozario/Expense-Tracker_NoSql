const Razorpay = require('razorpay');
const Order = require('../models/orderModel')
const userController = require('./userController')

const purchasepremium = async (req, res) => {
    try {
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
        const amount = 2500;

        rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
            if (err) {
                throw new Error(JSON.stringify(err));
            }
            Order.create({
                paymentId: order.id,
                orderId: order.id, 
                status: 'PENDING',
                userId: req.user.id,
            }).then(() => {
                return res.status(201).json({ order, key_id: rzp.key_id });
            }).catch(err => {
                throw new Error(err);
            });
        });
    } catch (err) {
        console.log(err);
        res.status(403).json({ message: 'Something went wrong', error: err });
    }
};

const updateTransactionStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const { payment_id, order_id } = req.body;

        // Correct field names based on MongoDB schema
        const order = await Order.findOne({ orderId: order_id });
        
        const promise1 = order.updateOne({ paymentId: payment_id, status: 'SUCCESSFUL' });
        const promise2 = req.user.updateOne({ isPremiumUser: true });  
        
        Promise.all([promise1, promise2]).then(() => {
            return res.status(202).json({
                success: true,
                message: "Transaction Successful",
                token: userController.generateAccessToken(userId, undefined, true)
            });
        }).catch((error) => {
            console.error(error);
            throw new Error(error);
        });
    } catch (err) {
        console.error(err);
        res.status(403).json({ error: err, message: 'Something went wrong' });
    }
};

module.exports = {
    purchasepremium,
    updateTransactionStatus
}