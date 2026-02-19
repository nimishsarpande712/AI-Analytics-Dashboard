const { Campaign } = require('../models');
const { Op } = require('sequelize');
const { Parser } = require('json2csv');

// Helper function to build where clause
const buildWhereClause = (query) => {
    const whereClause = {};
    
    if (query.search) {
        whereClause.campaign_name = { [Op.like]: `%${query.search}%` };
    }
    
    if (query.status) {
        whereClause.status = query.status;
    }
    
    if (query.startDate && query.endDate) {
        whereClause.start_date = {
            [Op.between]: [new Date(query.startDate), new Date(query.endDate)]
        };
    }
    
    return whereClause;
};

const { Campaign } = require('../models');
const { Op } = require('sequelize');
const { Parser } = require('json2csv');
const marketingAPI = require('../services/marketingAPI');
const AuditLog = require('../services/auditLog');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 300 }); // 5 minutes cache

// Calculate custom metrics
const calculateCustomMetrics = (campaign) => {
    const metrics = {
        ...campaign.toJSON(),
        roas: campaign.revenue / campaign.spend, // Return on Ad Spend
        cpc: campaign.spend / campaign.clicks, // Cost per Click
        ctr: (campaign.clicks / campaign.impressions) * 100, // Click-through Rate
        conversionRate: (campaign.conversions / campaign.clicks) * 100, // Conversion Rate
        cpa: campaign.spend / campaign.conversions, // Cost per Acquisition
    };
    return metrics;
};

// Get campaigns with pagination, sorting, and filtering
exports.getCampaigns = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const sort = req.query.sort || 'start_date';
        const order = req.query.order?.toUpperCase() || 'DESC';
        
        const whereClause = buildWhereClause(req.query);
        
        const result = await Campaign.findAndCountAll({
            where: whereClause,
            limit: limit,
            offset: (page - 1) * limit,
            order: [[sort, order]],
        });
        
        res.json({
            campaigns: result.rows,
            currentPage: page,
            totalPages: Math.ceil(result.count / limit),
            totalRecords: result.count
        });
    } catch (error) {
        console.error('Error fetching campaigns:', error);
        res.status(500).json({ error: 'Failed to fetch campaigns' });
    }
};

// Export campaigns to CSV
exports.exportCampaigns = async (req, res) => {
    try {
        const whereClause = buildWhereClause(req.query);
        
        const campaigns = await Campaign.findAll({
            where: whereClause,
            order: [['start_date', 'DESC']]
        });
        
        const fields = [
            'campaign_name',
            'channel',
            'campaign_type',
            'target_audience',
            'budget',
            'spend',
            'revenue',
            'impressions',
            'clicks',
            'conversions',
            'start_date',
            'end_date',
            'status',
            'geo_location',
            'device_type',
            'age_group',
            'gender',
            'interests',
            'ad_format',
            'landing_page_url',
            'notes'
        ];
        
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(campaigns);
        
        res.header('Content-Type', 'text/csv');
        res.attachment('campaigns.csv');
        res.send(csv);
    } catch (error) {
        console.error('Error exporting campaigns:', error);
        res.status(500).json({ error: 'Failed to export campaigns' });
    }
};

// Get campaign analytics
exports.getCampaignAnalytics = async (req, res) => {
    try {
        const whereClause = buildWhereClause(req.query);
        
        const campaigns = await Campaign.findAll({
            where: whereClause,
            attributes: [
                [Campaign.sequelize.fn('SUM', Campaign.sequelize.col('impressions')), 'totalImpressions'],
                [Campaign.sequelize.fn('SUM', Campaign.sequelize.col('clicks')), 'totalClicks'],
                [Campaign.sequelize.fn('SUM', Campaign.sequelize.col('conversions')), 'totalConversions'],
                [Campaign.sequelize.fn('SUM', Campaign.sequelize.col('spend')), 'totalSpend'],
                [Campaign.sequelize.fn('SUM', Campaign.sequelize.col('revenue')), 'totalRevenue'],
                [Campaign.sequelize.fn('AVG', Campaign.sequelize.col('ctr')), 'averageCTR'],
                [Campaign.sequelize.fn('AVG', Campaign.sequelize.col('conversion_rate')), 'averageConversionRate'],
                [Campaign.sequelize.fn('AVG', Campaign.sequelize.col('roas')), 'averageROAS'],
            ]
        });
        
        res.json(campaigns[0]);
    } catch (error) {
        console.error('Error fetching campaign analytics:', error);
        res.status(500).json({ error: 'Failed to fetch campaign analytics' });
    }
};
