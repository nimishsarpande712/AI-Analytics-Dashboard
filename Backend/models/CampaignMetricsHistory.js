const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const CampaignMetricsHistory = sequelize.define('CampaignMetricsHistory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  campaign_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  metrics_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  impressions: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  clicks: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  conversions: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  spend: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  revenue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'campaign_metrics_history',
  timestamps: false,
  indexes: [
    {
      fields: ['campaign_id']
    },
    {
      fields: ['metrics_date']
    }
  ]
});

// Class methods
CampaignMetricsHistory.getHistoricalPerformance = async function(campaignId, startDate, endDate) {
  return await this.findAll({
    where: {
      campaign_id: campaignId,
      metrics_date: {
        [Op.between]: [startDate, endDate]
      }
    },
    order: [['metrics_date', 'ASC']]
  });
};

CampaignMetricsHistory.getDailyTotals = async function(startDate, endDate) {
  return await this.findAll({
    attributes: [
      'metrics_date',
      [sequelize.fn('SUM', sequelize.col('impressions')), 'totalImpressions'],
      [sequelize.fn('SUM', sequelize.col('clicks')), 'totalClicks'],
      [sequelize.fn('SUM', sequelize.col('conversions')), 'totalConversions'],
      [sequelize.fn('SUM', sequelize.col('spend')), 'totalSpend'],
      [sequelize.fn('SUM', sequelize.col('revenue')), 'totalRevenue']
    ],
    where: {
      metrics_date: {
        [Op.between]: [startDate, endDate]
      }
    },
    group: ['metrics_date'],
    order: [['metrics_date', 'ASC']]
  });
};

module.exports = CampaignMetricsHistory;
