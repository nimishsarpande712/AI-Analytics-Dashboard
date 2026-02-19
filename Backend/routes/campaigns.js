const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Campaign = require('../models/Campaign');

// @desc    Get all metric cards
// @route   GET /api/campaigns/metrics
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
          metrics: []
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
    
    const realMetrics = {
      totalUsers: totalConversions,
      revenue: totalRevenue,
      conversionRate: conversionRate,
      activeSessions: totalClicks,
      totalCampaigns: campaigns.length,
      totalSpend: totalSpend,
      totalImpressions: totalImpressions,
      roas: roas,
      metrics: campaigns.map(campaign => ({
        id: campaign.id,
        name: campaign.campaign_name,
        channel: campaign.channel,
        revenue: parseFloat(campaign.revenue || 0),
        spend: parseFloat(campaign.spend || 0),
        conversions: parseInt(campaign.conversions || 0),
        clicks: parseInt(campaign.clicks || 0),
        impressions: parseInt(campaign.impressions || 0),
        roas: campaign.spend > 0 ? (campaign.revenue / campaign.spend).toFixed(2) : 0
      }))
    };

    res.json({
      success: true,
      data: realMetrics,
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

// @desc    Get all campaigns from database
// @route   GET /api/campaigns
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { status, channel, limit = 50, offset = 0 } = req.query;
    
    // Build where clause
    const whereClause = {};
    if (status) {
      whereClause.status = status.toLowerCase();
    }
    if (channel) {
      whereClause.channel = { [Op.iLike]: `%${channel}%` };
    }

    // Get campaigns from database
    const { count, rows } = await Campaign.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        count: rows.length,
        offset: parseInt(offset),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Database error:', error);
    
    // Fallback to mock data if database fails
    let filteredCampaigns = [...campaigns];

    if (status) {
      filteredCampaigns = filteredCampaigns.filter(campaign => 
        campaign.status.toLowerCase() === status.toLowerCase()
      );
    }

    if (channel) {
      filteredCampaigns = filteredCampaigns.filter(campaign => 
        campaign.channel.toLowerCase().includes(channel.toLowerCase())
      );
    }

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
      },
      note: 'Using mock data - database connection failed'
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
