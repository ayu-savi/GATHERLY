const dotenv = require('dotenv');

// Load environment variables before any other application modules
dotenv.config();

const app = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 5000;

// Initialize server
const startServer = async () => {
  // Attempt MongoDB connection
  await connectDB();

  // Start Express server
  const server = app.listen(PORT, () => {
    console.log('\x1b[35m%s\x1b[0m', '================================================');
    console.log('\x1b[36m%s\x1b[0m', `🚀 GATHERLY API Server running on port ${PORT}`);
    console.log('\x1b[36m%s\x1b[0m', `📡 Health Check: http://localhost:${PORT}/api/health`);
    console.log('\x1b[35m%s\x1b[0m', '================================================');
  });

  // Handle unhandled promise rejections gracefully
  process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err.message);
  });
};

startServer();

