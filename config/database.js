const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;
const dbHost = process.env.DB_HOST;

const mongoURI = `mongodb+srv://${dbUser}:${dbPassword}@${dbHost}/${dbName}?authSource=admin`;

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected');

    // Initialize GridFS
    const conn = mongoose.createConnection(mongoURI);
    conn.once('open', () => {
      global.gfs = Grid(conn.db, mongoose.mongo);
      global.gfs.collection('uploads'); // Set the collection name for GridFS
    });
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;