// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/leaderboard', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// Include the user model
const User = require('./models/user');

// Fetch the top 5 users based on coins
app.get('/api/leaderboard', async (req, res) => {
    // console.log("NJ: got the API call leaderboard");
  try {
    let topUsers = await User.find().sort({ maxDistTravelled: -1 }).limit(50);
    topUsers.forEach(user => {
        console.log(" topUsers : " + user.username + " maxDistTravelled: " + user.maxDistTravelled);
      });
    res.json(topUsers);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching leaderboard data' });
  }
});

// Fetch a user's rank based on coins
app.get('/api/user/:username/rank', async (req, res) => {
    console.log("NJ: got the API call rank");
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const rank = await User.countDocuments({ maxDistTravelled: { $gt: user.maxDistTravelled } }) + 1;
    console.log("rank : " + rank + { rank : rank, maxDistTravelled: user.maxDistTravelled});
    res.json({ rank : rank, coins: user.coins, maxDistTravelled: user.maxDistTravelled});
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user rank' });
  }
});

// Update user data
app.post('/api/user/:username', async (req, res) => {
    console.log("NJ: got the API call user");
  const { username } = req.params;
  const { coins, maxDistTravelled, lastOneDistTravelled, lastTwoDistTravelled } = req.body;
  const userOld = await User.findOne({ username });
  lastTwoDistTravelled = userOld.lastOneDistTravelled;
  lastOneDistTravelled = maxDistTravelled;
  if (userOld.maxDistTravelled > maxDistTravelled) maxDistTravelled = userOld.maxDistTravelled;
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

app.post('/api/user/:username/save', async (req, res) => {
    console.log("NJ: got the API call save");
    const { username } = req.params;
    const { coins, maxDistTravelled, lastOneDistTravelled, lastTwoDistTravelled } = req.body;
    try {
        console.log("NJ: 1 got the API call : username : " + username + " coins : " + coins +  " maxDistTravelled : " + maxDistTravelled);
        let userOld = await User.findOne({ username });
        console.log("NJ: 3 got the API call");
        if (userOld.maxDistTravelled > maxDistTravelled) maxDistTravelled = userOld.maxDistTravelled;

        console.log("NJ: 2 got the API call : username : " + username + " coins : " + coins +  " maxDistTravelled : " + maxDistTravelled);
        const user = await User.findOneAndUpdate(
            { username },
            { coins, maxDistTravelled, lastOneDistTravelled, lastTwoDistTravelled },
            { new: true, upsert: true }
        );
      console.log("save: user Name : " + user.username + " coins : " + user.coins + " maxDistTravelled : " + maxDistTravelled);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error updating user data' });
    }
  });

  // Update distance API - Update user's traveled distances
app.post('/api/user/:username/update-distance', async (req, res) => {
    console.log("NJ: got the API call update-distance");
    const { username } = req.params;
    const { userScore } = req.body;
    try {
      const user = await User.findOneAndUpdate(
        { username },
        { maxDistTravelled : userScore },
        { new: true, upsert: true }
      );
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error updating user data' });
    }
  });

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
