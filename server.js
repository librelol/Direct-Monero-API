const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
require('dotenv').config();
const verboseLogging = true; // Set to true to enable verbose logging

const connectDB = require('./config/database');
const { apiLimiter } = require('./middleware/rateLimiter');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to the database
connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(apiLimiter);

// Verbose logging middleware
if (verboseLogging) {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
  });
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);

// Route to check if the api is working
app.get('/api', (req, res) => {
  res.json({ message: 'API is running' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`API is running on port ${PORT}`);
});