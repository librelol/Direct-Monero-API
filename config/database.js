const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;
const dbHost = process.env.DB_HOST;

const mongoURI = process.env.MONGODB_URI || `mongodb+srv://${dbUser}:${dbPassword}@${dbHost}/${dbName}?retryWrites=true&w=majority`;

const maxRetries = 5;
const retryDelay = 30; // 5 seconds

const connectDB = async () => {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      await mongoose.connect(mongoURI);
      console.log('MongoDB connected');

      // Initialize GridFS
      const conn = mongoose.createConnection(mongoURI);
      conn.once('open', () => {
        global.gfs = Grid(conn.db, mongoose.mongo);
        global.gfs.collection('uploads'); // Set the collection name for GridFS
      });

      // Configure multer storage
      const storage = multer.memoryStorage();
      global.upload = multer({ storage });

      return; // Exit the function if connection is successful
    } catch (err) {
      retries += 1;
      console.error(`MongoDB connection error (attempt ${retries}):`, err);
      if (retries < maxRetries) {
        console.log(`Retrying in ${retryDelay / 1000} seconds...`);
        await new Promise(res => setTimeout(res, retryDelay));
      } else {
        console.error('Max retries reached. Exiting...');
        process.exit(1);
      }
    }
  }
};

module.exports = connectDB;