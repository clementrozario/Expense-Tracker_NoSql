const mongoose = require('mongoose');

const forgotPasswordSchema = new mongoose.Schema({
    active: {
        type: Boolean,
        required: true,
    },
    expiresBy: {
        type: Date,
        required: true,
        default: () => Date.now() + 3600000, // Set a default expiration time (e.g., 1 hour from now)
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

const ForgotPassword = mongoose.model('ForgotPassword', forgotPasswordSchema);

module.exports = ForgotPassword;
