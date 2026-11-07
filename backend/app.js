const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const apiRouter = require('./routes/api');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// CORS configuration
const rawOrigins = process.env.FRONTEND_URL || process.env.CLIENT_URL || '';
const configuredOrigins = rawOrigins.split(',').map((o) => o.trim()).filter(Boolean);

const allowedOrigins = process.env.NODE_ENV === 'production'
  ? (configuredOrigins.length > 0 ? configuredOrigins : ['http://localhost:5173'])
  : [
      ...configuredOrigins,
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
    ];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, postman, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(new Error('CORS policy: Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// API Routes prefix
app.use('/api', apiRouter);

// Root path friendly message
app.get('/', (req, res) => {
  res.json({
    message: 'GATHERLY Backend Server is running.',
    healthCheck: '/api/health',
  });
});

// 404 handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized error handling middleware
app.use(errorHandler);

module.exports = app;

