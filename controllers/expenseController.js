const mongoose = require('mongoose');
const Expense = require('../models/expenseModel');
const User = require('../models/userModel');
const S3Services = require('../services/S3services');
const Url = require('../models/downloadUrlModel');

const downloadExpenses = async (req, res, next) => {
    try {
        const userid = req.user.id;
        const expenses = await Expense.find({ userId: userid });
        const stringExp = JSON.stringify(expenses);
        const filename = `Expense${userid}/${new Date()}.txt`;

        // Upload to S3 and handle errors
        try {
            await S3Services.uploadToS3(stringExp, filename);

            // Construct the URL using the bucket name and object key
            const bucketName = 'expensetracker-app';
            const fileURL = `https://${bucketName}.s3.amazonaws.com/${filename}`;

            // Save the URL to the database
            const newUrl = await Url.create({ url: fileURL, userId: userid });
            
            res.status(200).json({ fileURL: newUrl.url, success: true });
        } catch (uploadError) {
            console.error("Error uploading to S3:", uploadError);
            res.status(500).json({ fileURL: null, success: false, error: "Error uploading to S3" });
        }
    } catch (err) {
        console.error("Error fetching expenses:", err);
        res.status(500).json({ fileURL: null, success: false, error: err.message });
    }
}

const downloadUrls = async (req, res, next) => {
    try {
        const urls = await Url.find({ userId: req.user.id });
        const formattedUrls = urls.map(url => {
            return {
                id: url._id,
                url: url.url,
                createdAt: url.createdAt
            };
        });
        res.status(200).json({ allUrls: formattedUrls });
    } catch (err) {
        console.error("Error fetching download URLs:", err);
        res.status(500).json({ error: "Error fetching download URLs. Please try again later." });
    }
}

const addexpense = async (req, res) => {
    const { expenseamount, description, category } = req.body;

    if (!expenseamount || !description || !category) {
        return res.status(400).json({ success: false, message: 'Parameters missing' });
    }

    try {
        const expense = await Expense.create({ 
            expenseamount, 
            description, 
            category, 
            userId: req.user.id 
        });

        const user = await User.findById(req.user.id);
        user.totalExpenses += parseFloat(expenseamount);
        await user.save();

        return res.status(200).json({ expense, success: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: err.message });
    }
};

const getexpenses = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5; // Number of items per page
    const skip = (page - 1) * pageSize;

    try {
        const expenses = await Expense.find({ userId: req.user.id }).skip(skip).limit(pageSize);
        const totalItems = await Expense.countDocuments({ userId: req.user.id });

        return res.status(200).json({ expenses, totalItems, success: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err, success: false });
    }
};

const deleteexpense = async (req, res) => {
    const expenseId = req.params.expenseid;

    if (!expenseId || !mongoose.Types.ObjectId.isValid(expenseId)) {
        return res.status(400).json({ success: false, message: 'Invalid expense ID' });
    }

    try {
        const expense = await Expense.findOneAndDelete({ _id: expenseId, userId: req.user.id });
        
        if (!expense) {
            return res.status(404).json({ success: false, message: 'Expense does not belong to the user' });
        }

        const user = await User.findById(req.user.id);
        user.totalExpenses -= parseFloat(expense.expenseamount);
        await user.save();

        return res.status(200).json({ success: true, message: "Expense deleted successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Failed to delete expense" });
    }
};

module.exports = {
    deleteexpense,
    getexpenses,
    addexpense,
    downloadExpenses,
    downloadUrls
};
