const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const isStringInvalid = (string) => {
    return string == undefined || string.length === 0;
};

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (isStringInvalid(name) || isStringInvalid(email) || isStringInvalid(password)) {
            return res.status(400).json({ err: "Bad parameters. Something is missing" });
        }

        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds);

        await User.create({ name, email, password: hash });
        res.status(201).json({ message: 'Successfully created new user' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const generateAccessToken = (id, name, isPremiumUser) => {
    return jwt.sign({ userId: id, name, isPremiumUser }, 'secretkey');
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (isStringInvalid(email) || isStringInvalid(password)) {
            return res.status(400).json({ message: 'Email or password is missing', success: false });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User does not exist' });
        }

        const result = await bcrypt.compare(password, user.password);

        if (result) {
            const token = generateAccessToken(user._id, user.name, user.isPremiumUser);
            return res.status(200).json({ success: true, message: 'User logged in successfully', token });
        } else {
            return res.status(400).json({ success: false, message: 'Password is incorrect' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error', success: false });
    }
};

module.exports = {
    signup,
    login,
    generateAccessToken,
};
