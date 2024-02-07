const User = require('../models/userModel');

const getUserLeaderBoard = async (req, res) => {
  try {
    const leaderboardOfUsers = await User.find({}, ['name', 'totalExpenses'])
      .sort({ totalExpenses: -1 })
      .exec();

    res.status(200).json(leaderboardOfUsers);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

module.exports = {
  getUserLeaderBoard,
};