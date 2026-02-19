const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const { sequelize, testConnection } = require('./config/db');
require('dotenv').config();

// Import routes
const campaignRoutes = require('./routes/campaigns');
const dataRoutes = require('./routes/data');
const dashboardRoutes = require('./routes/dashboard');
const analyticsRoutes = require('./routes/analytics');
const reportsRoutes = require('./routes/reports');
const websocketRoutes = require('./routes/websocket');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

const app = express();
const PORT = process.env.PORT || 5001;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Compression middleware
app.use(compression());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize WebSocket service
const http = require('http');
const server = http.createServer(app);
const WebSocketService = require('./services/WebSocketService');
global.wsService = new WebSocketService(server);

// Add WebSocket service to sequelize for models to access
sequelize.wsService = global.wsService;

// Add database changes middleware
const databaseChangesMiddleware = require('./middleware/databaseChanges');
app.use(databaseChangesMiddleware);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use('/api/campaigns', campaignRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/reports', reportsRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'ADmyBRAND API is running',
    version: '1.0.0',
    status: 'Running'
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.log('⚠️  Starting server without database connection');
    } else {
      // Initialize models
      const models = require('./models');
      await models.sequelize.sync(); // Normal sync after initial setup
      console.log('📦 Database models synchronized');

      // Seed the database with sample data
      try {
        const CampaignSeeder = require('./seeders/campaignSeeder');
        const seeder = new CampaignSeeder();
        await seeder.seedFromCSV();
        console.log('🌱 Sample data seeded successfully');
      } catch (seedError) {
        console.log('⚠️  Could not seed sample data:', seedError.message);
      }

      // Set up WebSocket service global references
      global.models = models;
      models.sequelize.wsService = global.wsService;
    }

    server.listen(PORT, () => {
      console.log(`🚀 ADmyBRAND Server running on port ${PORT}`);
      console.log(`📊 API endpoint: http://localhost:${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;
