const express = require('express');
const router = express.Router();

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

module.exports = router;
