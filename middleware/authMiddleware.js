const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        // console.log(token);

        const decodedUser = jwt.verify(token, 'secretkey');
        // console.log('userID >>>> ', decodedUser.userId);

        const dbUser = await User.findById(decodedUser.userId);

        if (!dbUser) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        req.user = dbUser;
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
};

module.exports = {
    authenticate,
};
