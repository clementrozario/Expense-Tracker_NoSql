const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mongoose = require('mongoose');
const SibApiV3Sdk = require('sib-api-v3-sdk');

const User = require('../models/userModel');
const Forgotpassword = require('../models/passwordResetModel');

require('dotenv').config();

const sendinblue = new SibApiV3Sdk.TransactionalEmailsApi();
SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = process.env.SENDINBLUE_API_KEY;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const forgotpassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (user) {
            const id = uuid.v4();
            await Forgotpassword.create({ id, active: true, userId: user._id });

            const sendinblueEmail = {
                sender: {
                    name: 'Clement',
                    email: 'rozariomartin05@gmail.com'
                },
                to: [{ email: email }],
                subject: 'Reset Your Password',
                htmlContent: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`
            };

            await sendinblue.sendTransacEmail(sendinblueEmail);

            return res.status(200).json({ message: 'Link to reset password sent to your mail', success: true });
        } else {
            throw new Error('User does not exist');
        }
    } catch (err) {
        console.error(err);
        return res.json({ message: err.message, success: false });
    }
};

const resetpassword = (req, res) => {
    const id = req.params.id;
    Forgotpassword.findOne({ id, active: true }).then(async (forgotpasswordrequest) => {
        if (forgotpasswordrequest) {
            await forgotpasswordrequest.updateOne({ active: false });

            return res.status(200).send(`
                <html>
                    <script>
                        function formsubmitted(e){
                            e.preventDefault();
                            console.log('called');
                        }
                    </script>
                    <form action="/password/updatepassword/${id}" method="get">
                        <label for="newpassword">Enter New password</label>
                        <input name="newpassword" type="password" required></input>
                        <button>reset password</button>
                    </form>
                </html>`
            );
        }
    }).catch(err => {
        console.error(err);
        return res.status(500).json({ message: err.message, success: false });
    });
};

const updatepassword = async (req, res) => {
    try {
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;
        const forgotpasswordrequest = await Forgotpassword.findOne({ id: resetpasswordid, active: false });

        if (forgotpasswordrequest) {
            const user = await User.findById(forgotpasswordrequest.userId);

            if (user) {
                const saltRounds = 10;
                const hash = await bcrypt.hash(newpassword, saltRounds);
                await user.updateOne({ password: hash });

                return res.status(201).json({ message: 'Successfully updated the new password', success: true });
            } else {
                return res.status(404).json({ error: 'No user exists', success: false });
            }
        } else {
            return res.status(400).json({ error: 'Invalid or expired reset link', success: false });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message, success: false });
    }
};

module.exports = {
    forgotpassword,
    updatepassword,
    resetpassword
};
