// Expense model

const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  expenseamount: {
    type: Number,
    required: true,
  },
  description: String,
  category: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true,
  },
});

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
