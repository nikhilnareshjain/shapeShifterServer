// routes.js

const express = require('express');
const router = express.Router();
const User = require('user');

// GET user data
router.get('/api/user/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const user = await User.findOne({ username });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user data' });
  }
});

// POST update user data
router.post('/api/user/:username', async (req, res) => {
  const username = req.params.username;
  const { coins, maxDistTravelled, lastOneDistTravelled, lastTwoDistTravelled } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { username },
      { coins, maxDistTravelled, lastOneDistTravelled, lastTwoDistTravelled },
      { new: true, upsert: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error updating user data' });
  }
});

module.exports = router;
