const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');
const { sequelize } = require('../config/db');

// @desc    Get data sources
// @route   GET /api/data/sources
// @access  Public
router.get('/sources', async (req, res) => {
  try {
    // Get real database stats
    const campaignCount = await Campaign.count();
    const dbStatus = await sequelize.authenticate().then(() => 'Connected').catch(() => 'Disconnected');
    
    const dataSources = [
      {
        id: 1,
        name: 'Campaign Database',
        type: 'database',
        status: dbStatus,
        color: dbStatus === 'Connected' ? 'green' : 'red',
        lastSync: new Date().toISOString(),
        recordCount: campaignCount,
        description: 'Marketing campaign performance data from database'
      },
      {
        id: 2,
        name: 'Analytics Engine',
        type: 'analytics',
        status: 'Connected',
        color: 'green',
        lastSync: new Date().toISOString(),
        recordCount: campaignCount * 10, // Estimated analytics records
        description: 'Real-time analytics data from campaign database'
      },
      {
        id: 3,
        name: 'Revenue Tracking',
        type: 'finance',
        status: campaignCount > 0 ? 'Connected' : 'No Data',
        color: campaignCount > 0 ? 'green' : 'orange',
        lastSync: new Date().toISOString(),
        recordCount: campaignCount,
        description: 'Revenue and ROAS data from campaign database'
      },
      {
        id: 4,
        name: 'Performance Metrics',
        type: 'metrics',
        status: 'Connected',
        color: 'green',
        lastSync: new Date().toISOString(),
        recordCount: campaignCount * 5, // Estimated metric records
        description: 'Campaign performance metrics and KPIs'
      }
    ];

    res.json({
      success: true,
      data: dataSources,
      count: dataSources.length,
      totalRecords: campaignCount,
      databaseStatus: dbStatus
    });
  } catch (error) {
    console.error('Data sources error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch data sources from database',
      message: error.message
    });
  }
});

// @desc    Upload data file
// @route   POST /api/data/upload
// @access  Public
router.post('/upload', async (req, res) => {
  try {
    // Mock file upload response
    const uploadResult = {
      fileId: Date.now(),
      fileName: 'data_upload.csv',
      fileSize: '2.4 MB',
      recordCount: 1520,
      status: 'processing',
      uploadTime: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: uploadResult
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to upload file'
    });
  }
});

// @desc    Get data export
// @route   GET /api/data/export
// @access  Public
router.get('/export', async (req, res) => {
  try {
    const { format = 'csv', dateRange, dataSource } = req.query;
    
    // Mock export data
    const exportData = {
      exportId: Date.now(),
      format,
      dateRange,
      dataSource,
      status: 'preparing',
      estimatedTime: '2-5 minutes',
      downloadUrl: null
    };

    res.json({
      success: true,
      message: 'Export initiated',
      data: exportData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to initiate export'
    });
  }
});

// @desc    Get data visualization data
// @route   GET /api/data/visualization
// @access  Public
router.get('/visualization', async (req, res) => {
  try {
    const { chartType = 'line', metric = 'users', timeRange = '7d' } = req.query;
    
    // Generate mock visualization data
    const visualizationData = {
      chartType,
      metric,
      timeRange,
      data: generateVisualizationData(chartType, metric),
      metadata: {
        title: `${metric} (${timeRange})`,
        description: `${chartType} chart showing ${metric} over ${timeRange}`,
        updatedAt: new Date().toISOString()
      }
    };

    res.json({
      success: true,
      data: visualizationData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch visualization data'
    });
  }
});

// @desc    Sync data source
// @route   POST /api/data/sync/:sourceId
// @access  Public
router.post('/sync/:sourceId', async (req, res) => {
  try {
    const { sourceId } = req.params;
    
    // Mock sync operation
    const syncResult = {
      sourceId: parseInt(sourceId),
      status: 'syncing',
      startTime: new Date().toISOString(),
      estimatedDuration: '3-7 minutes',
      lastSyncRecords: Math.floor(Math.random() * 1000) + 100
    };

    res.json({
      success: true,
      message: 'Data sync initiated',
      data: syncResult
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to initiate data sync'
    });
  }
});

// Helper function to generate mock visualization data
function generateVisualizationData(chartType, metric) {
  const baseData = [];
  const days = 30;
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    baseData.push({
      date: date.toISOString().split('T')[0],
      value: Math.floor(Math.random() * 1000) + 100,
      label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    });
  }
  
  switch (chartType) {
    case 'pie':
      return [
        { name: 'Desktop', value: 45, color: '#3B82F6' },
        { name: 'Mobile', value: 35, color: '#10B981' },
        { name: 'Tablet', value: 20, color: '#F59E0B' }
      ];
    
    case 'bar':
      return baseData.slice(-7); // Last 7 days for bar chart
    
    default: // line chart
      return baseData;
  }
}

module.exports = router;
