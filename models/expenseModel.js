
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
    ref: 'User', 
    required: true,
  },
});

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
