const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
require('dotenv').config();

const connectDB = require('./config/database');
const { apiLimiter } = require('./middleware/rateLimiter');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');

const app = express();
const PORT = process.env.PORT || 8000;

// Connect to the database
connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);

app.use('/api', (req, res) => {
  res.json({ message: 'API is running' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`API is running on port ${PORT}`);
});