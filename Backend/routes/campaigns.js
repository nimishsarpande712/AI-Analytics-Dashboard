const express = require('express');
const router = express.Router();
const { metricCards, chartData, campaigns, channelPerformance } = require('../data/mockData');

// @desc    Get all metric cards
// @route   GET /api/campaigns/metrics
// @access  Public
router.get('/metrics', (req, res) => {
  try {
    res.json({
      success: true,
      data: metricCards,
      count: metricCards.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch metrics'
    });
  }
});

// @desc    Get chart data
// @route   GET /api/campaigns/chart-data
// @access  Public
router.get('/chart-data', (req, res) => {
  try {
    const { timeRange = '12m' } = req.query;
    
    res.json({
      success: true,
      data: chartData,
      timeRange,
      count: chartData.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch chart data'
    });
  }
});

// @desc    Get all campaigns
// @route   GET /api/campaigns
// @access  Public
router.get('/', (req, res) => {
  try {
    const { status, channel, limit, offset } = req.query;
    let filteredCampaigns = [...campaigns];

    // Filter by status
    if (status) {
      filteredCampaigns = filteredCampaigns.filter(campaign => 
        campaign.status.toLowerCase() === status.toLowerCase()
      );
    }

    // Filter by channel
    if (channel) {
      filteredCampaigns = filteredCampaigns.filter(campaign => 
        campaign.channel.toLowerCase().includes(channel.toLowerCase())
      );
    }

    // Pagination
    const startIndex = parseInt(offset) || 0;
    const endIndex = limit ? startIndex + parseInt(limit) : filteredCampaigns.length;
    const paginatedCampaigns = filteredCampaigns.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedCampaigns,
      pagination: {
        total: filteredCampaigns.length,
        count: paginatedCampaigns.length,
        offset: startIndex,
        limit: parseInt(limit) || filteredCampaigns.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch campaigns'
    });
  }
});

// @desc    Get single campaign
// @route   GET /api/campaigns/:id
// @access  Public
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const campaign = campaigns.find(camp => camp.id === id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        error: 'Campaign not found'
      });
    }

    res.json({
      success: true,
      data: campaign
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch campaign'
    });
  }
});

// @desc    Get channel performance
// @route   GET /api/campaigns/channels/performance
// @access  Public
router.get('/channels/performance', (req, res) => {
  try {
    res.json({
      success: true,
      data: channelPerformance,
      count: channelPerformance.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch channel performance'
    });
  }
});

// @desc    Get campaign performance summary
// @route   GET /api/campaigns/summary
// @access  Public
router.get('/summary', (req, res) => {
  try {
    const activeCampaigns = campaigns.filter(camp => camp.status === 'active');
    const totalSpend = campaigns.reduce((sum, camp) => sum + camp.spend, 0);
    const totalRevenue = campaigns.reduce((sum, camp) => sum + camp.revenue, 0);
    const avgRoas = totalRevenue / totalSpend;

    const summary = {
      totalCampaigns: campaigns.length,
      activeCampaigns: activeCampaigns.length,
      totalSpend: totalSpend,
      totalRevenue: totalRevenue,
      avgRoas: Math.round(avgRoas * 100) / 100,
      topPerformingCampaign: campaigns.reduce((prev, current) => 
        (prev.roas > current.roas) ? prev : current
      ),
      channels: [...new Set(campaigns.map(camp => camp.channel))].length
    };

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch campaign summary'
    });
  }
});

module.exports = router;
