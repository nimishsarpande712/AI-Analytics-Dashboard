const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');

// @desc    Get dashboard metrics
// @route   GET /api/dashboard/metrics
// @access  Public
router.get('/metrics', async (req, res) => {
  try {
    // Get real data from database
    const campaigns = await Campaign.findAll();
    
    if (campaigns.length === 0) {
      return res.json({
        success: true,
        data: {
          totalUsers: 0,
          revenue: 0,
          conversionRate: 0,
          activeSessions: 0,
          userGrowth: 0,
          revenueGrowth: 0,
          conversionGrowth: 0,
          sessionGrowth: 0
        },
        message: 'No campaign data available'
      });
    }

    // Calculate real metrics from database
    const totalRevenue = campaigns.reduce((sum, campaign) => sum + parseFloat(campaign.revenue || 0), 0);
    const totalSpend = campaigns.reduce((sum, campaign) => sum + parseFloat(campaign.spend || 0), 0);
    const totalImpressions = campaigns.reduce((sum, campaign) => sum + parseInt(campaign.impressions || 0), 0);
    const totalClicks = campaigns.reduce((sum, campaign) => sum + parseInt(campaign.clicks || 0), 0);
    const totalConversions = campaigns.reduce((sum, campaign) => sum + parseInt(campaign.conversions || 0), 0);
    
    const conversionRate = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(2) : 0;
    const roas = totalSpend > 0 ? (totalRevenue / totalSpend).toFixed(2) : 0;
    
    const metricsData = {
      totalUsers: totalConversions,
      revenue: totalRevenue,
      conversionRate: parseFloat(conversionRate),
      activeSessions: totalClicks,
      userGrowth: Math.floor(Math.random() * 20) + 5, // Mock growth data
      revenueGrowth: Math.floor(Math.random() * 15) + 3,
      conversionGrowth: Math.floor(Math.random() * 10) + 2,
      sessionGrowth: Math.floor(Math.random() * 25) + 8
    };

    res.json({
      success: true,
      data: metricsData,
      count: campaigns.length
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch metrics from database'
    });
  }
});

// @desc    Get dashboard chart data
// @route   GET /api/dashboard/chart-data
// @access  Public
router.get('/chart-data', async (req, res) => {
  try {
    const { timeRange = '30d' } = req.query;
    
    // Generate chart data based on time range
    const generateChartData = (days = 30) => {
      const data = [];
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        data.push({
          date: date.toISOString().split('T')[0],
          value: Math.floor(Math.random() * 5000) + 1000
        });
      }
      return data;
    };

    const chartData = {
      revenue: generateChartData(30),
      users: generateChartData(30),
      sessions: generateChartData(30)
    };

    res.json({
      success: true,
      data: { chartData },
      timeRange
    });
  } catch (error) {
    console.error('Chart data error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch chart data'
    });
  }
});

// @desc    Get dashboard overview data
// @route   GET /api/dashboard/overview
// @access  Public (should be protected in production)
router.get('/overview', async (req, res) => {
  try {
    // Mock data - replace with actual database queries
    const dashboardData = {
      stats: [
        { name: 'Total Users', value: '12,543', change: '+12%', trend: 'up' },
        { name: 'Revenue', value: '$45,231', change: '+8%', trend: 'up' },
        { name: 'Conversion Rate', value: '3.24%', change: '+2%', trend: 'up' },
        { name: 'Active Sessions', value: '2,341', change: '+18%', trend: 'up' },
      ],
      recentActivity: [
        { id: 1, action: 'New user registered', timestamp: new Date(Date.now() - 2 * 60 * 1000) },
        { id: 2, action: 'Payment received', timestamp: new Date(Date.now() - 5 * 60 * 1000) },
        { id: 3, action: 'Report generated', timestamp: new Date(Date.now() - 10 * 60 * 1000) },
        { id: 4, action: 'Data sync completed', timestamp: new Date(Date.now() - 15 * 60 * 1000) },
        { id: 5, action: 'User profile updated', timestamp: new Date(Date.now() - 20 * 60 * 1000) },
      ],
      chartData: {
        revenue: [
          { month: 'Jan', value: 4000 },
          { month: 'Feb', value: 3000 },
          { month: 'Mar', value: 5000 },
          { month: 'Apr', value: 4500 },
          { month: 'May', value: 6000 },
          { month: 'Jun', value: 5500 },
        ],
        users: [
          { month: 'Jan', value: 2400 },
          { month: 'Feb', value: 1398 },
          { month: 'Mar', value: 9800 },
          { month: 'Apr', value: 3908 },
          { month: 'May', value: 4800 },
          { month: 'Jun', value: 3800 },
        ]
      }
    };

    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard data'
    });
  }
});

// @desc    Get widget data
// @route   GET /api/dashboard/widgets/:widgetId
// @access  Public
router.get('/widgets/:widgetId', async (req, res) => {
  try {
    const { widgetId } = req.params;
    
    // Mock widget data
    const widgetData = {
      id: widgetId,
      title: `Widget ${widgetId}`,
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Sample Data',
          data: [12, 19, 3, 5, 2, 3],
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      }
    };

    res.json({
      success: true,
      data: widgetData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch widget data'
    });
  }
});

// @desc    Export dashboard data
// @route   POST /api/dashboard/export
// @access  Public
router.post('/export', async (req, res) => {
  try {
    const { type, format, dateRange } = req.body;
    
    // Get real campaign data for export
    const campaigns = await Campaign.findAll();
    const totalRevenue = campaigns.reduce((sum, campaign) => sum + parseFloat(campaign.revenue || 0), 0);
    const totalSpend = campaigns.reduce((sum, campaign) => sum + parseFloat(campaign.spend || 0), 0);
    const totalConversions = campaigns.reduce((sum, campaign) => sum + parseInt(campaign.conversions || 0), 0);
    
    const exportData = {
      exportId: Date.now(),
      type: type || 'dashboard',
      format: format || 'csv',
      dateRange: dateRange || 'last_30_days',
      status: 'completed',
      data: {
        totalCampaigns: campaigns.length,
        totalRevenue: totalRevenue,
        totalSpend: totalSpend,
        totalConversions: totalConversions,
        roas: totalSpend > 0 ? (totalRevenue / totalSpend).toFixed(2) : 0
      },
      createdAt: new Date().toISOString()
    };

    res.json({
      success: true,
      message: 'Dashboard data exported successfully',
      data: exportData
    });
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export dashboard data'
    });
  }
});

module.exports = router;
