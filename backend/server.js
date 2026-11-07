const dotenv = require('dotenv');

// Load environment variables before any other application modules
dotenv.config();

// Enforce secure JWT_SECRET in production
if (process.env.NODE_ENV === 'production') {
  const secret = process.env.JWT_SECRET;
  const insecureDefaults = [
    'gatherly_super_secret_jwt_key_2026_dev_env',
    'development_jwt_secret_key',
    'secret',
    'default_secret',
    'jwt_secret',
  ];
  if (!secret || secret.trim().length < 16 || insecureDefaults.includes(secret.trim())) {
    console.error('\x1b[31m%s\x1b[0m', '❌ [Security] FATAL: Production environment requires a strong, secure JWT_SECRET (minimum 16 characters).');
    process.exit(1);
  }
}

const app = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 5000;

// Initialize server
const startServer = async () => {
  // Attempt MongoDB connection
  const dbConnected = await connectDB();
  if (process.env.NODE_ENV === 'production' && !dbConnected) {
    console.error('\x1b[31m%s\x1b[0m', '❌ [Database] FATAL: Failed to connect to MongoDB in production mode. Aborting startup.');
    process.exit(1);
  }

  // Start Express server
  const server = app.listen(PORT, () => {
    console.log('\x1b[35m%s\x1b[0m', '================================================');
    console.log('\x1b[36m%s\x1b[0m', `🚀 GATHERLY API Server running on port ${PORT}`);
    console.log('\x1b[36m%s\x1b[0m', `📡 Health Check: http://localhost:${PORT}/api/health`);
    console.log('\x1b[35m%s\x1b[0m', '================================================');
  });

  // Graceful shutdown handler
  const handleShutdown = (signal) => {
    console.log(`\nReceived ${signal}. Shutting down GATHERLY gracefully...`);
    server.close(async () => {
      console.log('HTTP server closed.');
      try {
        const mongoose = require('mongoose');
        if (mongoose.connection && mongoose.connection.readyState !== 0) {
          await mongoose.connection.close(false);
          console.log('MongoDB connection closed.');
        }
      } catch (err) {
        console.error('Error during database teardown:', err.message);
      }
      process.exit(0);
    });

    // Fallback force kill after 10s timeout
    setTimeout(() => {
      console.error('Could not finish cleanup in time. Forcing process exit.');
      process.exit(1);
    }, 10000).unref();
  };

  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));

  // Handle unhandled promise rejections gracefully
  process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err.message);
  });
};

startServer();

