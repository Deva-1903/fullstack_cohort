const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

// instance
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://Deva:aLaK8eTb63F2O1Xv@ac-mgppflz-shard-00-00.fybmkgs.mongodb.net:27017,ac-mgppflz-shard-00-01.fybmkgs.mongodb.net:27017,ac-mgppflz-shard-00-02.fybmkgs.mongodb.net:27017/fullstack?ssl=true&replicaSet=atlas-nm89mi-shard-0&authSource=admin&retryWrites=true&w=majority')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));