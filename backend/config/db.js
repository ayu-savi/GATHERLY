const mongoose = require('mongoose');

let isConnected = false;

/**
 * Connect to MongoDB using Mongoose.
 * If MONGO_URI is missing or connection fails, logs an explicit, actionable
 * warning and leaves isConnected as false.
 */
const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri || uri.trim() === '') {
    console.warn('\x1b[33m%s\x1b[0m', '⚠️  [MongoDB] Warning: MONGO_URI is not set in environment variables.');
    console.warn('\x1b[33m%s\x1b[0m', '👉 Backend will run with database status: DISCONNECTED.');
    console.warn('\x1b[33m%s\x1b[0m', '👉 Configure MONGO_URI in backend/.env to connect to your MongoDB database.');
    isConnected = false;

    if (process.env.NODE_ENV === 'production') {
      console.error('\x1b[31m%s\x1b[0m', '❌ [MongoDB] FATAL: Production environment requires a configured MONGO_URI.');
      process.exit(1);
    }

    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;
    console.log('\x1b[32m%s\x1b[0m', `✅ [MongoDB] Connected successfully to host: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isConnected = false;
    console.error('\x1b[31m%s\x1b[0m', `❌ [MongoDB] Connection error: ${error.message}`);

    if (process.env.NODE_ENV === 'production') {
      console.error('\x1b[31m%s\x1b[0m', '❌ [MongoDB] FATAL: Production database connection failed. Aborting startup.');
      process.exit(1);
    }

    console.warn('\x1b[33m%s\x1b[0m', '👉 Backend continues running. Check your MONGO_URI credentials or network access.');
    return false;
  }
};

/**
 * Get current database connection status
 */
const getDBStatus = () => {
  const stateCode = mongoose.connection.readyState;
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  return {
    connected: isConnected && stateCode === 1,
    state: states[stateCode] || 'unknown',
    host: mongoose.connection.host || null,
    name: mongoose.connection.name || null,
  };
};

module.exports = {
  connectDB,
  getDBStatus,
};

