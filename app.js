const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const User = require('./models/userModel');
const Expense = require('./models/expenseModel');
const Order = require('./models/orderModel');
const Forgotpassword = require('./models/passwordResetModel');
// const Url = require('./models/downloadUrlModel');

const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const premiumFeatureRoutes = require('./routes/premiumFeatureRoutes');
const resetPasswordRoutes = require('./routes/passwordResetRoutes');

const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Unable to connect to MongoDB:', err);
  });


// Serve static files from the 'view' directory
const staticPath = path.resolve('./views');
app.use(express.static(staticPath));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/signup.html'));
});

app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium', premiumFeatureRoutes);
app.use('/password', resetPasswordRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
