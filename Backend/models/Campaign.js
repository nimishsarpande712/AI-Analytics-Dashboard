const { Sequelize, DataTypes, Op } = require('sequelize');
const { sequelize } = require('../config/db');

const Campaign = sequelize.define('Campaign', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  campaign_id: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  campaign_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  channel: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  campaign_type: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  target_audience: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  budget: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
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
  ctr: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    comment: 'Click Through Rate (%)'
  },
  cpc: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: true,
    comment: 'Cost Per Click'
  },
  cpm: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: true,
    comment: 'Cost Per Mille (1000 impressions)'
  },
  conversion_rate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    comment: 'Conversion Rate (%)'
  },
  roas: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: true,
    comment: 'Return on Ad Spend'
  },
  roi: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: true,
    comment: 'Return on Investment (%)'
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'paused', 'completed', 'draft'),
    allowNull: false,
    defaultValue: 'active'
  },
  geo_location: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  device_type: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  age_group: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  gender: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  interests: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  ad_format: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  landing_page_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  last_updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.fn('NOW')
  },
  update_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'campaigns',
  indexes: [
    {
      fields: ['campaign_id']
    },
    {
      fields: ['channel']
    },
    {
      fields: ['status']
    },
    {
      fields: ['start_date', 'end_date']
    }
  ],
  hooks: {
    beforeSave: async (campaign, options) => {
      // Update metrics calculations
      campaign.ctr = campaign.calculateCTR();
      campaign.cpc = campaign.calculateCPC();
      campaign.conversion_rate = campaign.calculateConversionRate();
      campaign.roas = campaign.calculateROAS();
      campaign.roi = campaign.calculateROI();
      
      // Update timestamp and count
      campaign.last_updated_at = new Date();
      campaign.update_count++;
    },
    afterSave: async (campaign, options) => {
      try {
        // Record metrics history if metrics have changed
        const changedMetrics = ['impressions', 'clicks', 'conversions', 'spend', 'revenue']
          .some(field => campaign.changed(field));

        if (changedMetrics) {
          const metricsHistory = await sequelize.models.CampaignMetricsHistory.create({
            campaign_id: campaign.id,
            metrics_date: new Date(),
            impressions: campaign.impressions - (campaign.previous('impressions') || 0),
            clicks: campaign.clicks - (campaign.previous('clicks') || 0),
            conversions: campaign.conversions - (campaign.previous('conversions') || 0),
            spend: campaign.spend - (campaign.previous('spend') || 0),
            revenue: campaign.revenue - (campaign.previous('revenue') || 0)
          });

          // Emit real-time update through WebSocket service
          if (global.wsService) {
            global.wsService.broadcast('metricsUpdate', {
              campaignId: campaign.id,
              metrics: metricsHistory.toJSON(),
              campaign: campaign.toJSON()
            });
          }
        }
      } catch (error) {
        console.error('Error in Campaign afterSave hook:', error);
        // Log error but don't throw to prevent transaction rollback
        await sequelize.models.AuditLog.create({
          table_name: 'Campaign',
          record_id: campaign.id,
          action_type: 'ERROR',
          new_values: { error: error.message }
        });
      }
    }
  }
});

// Instance methods
Campaign.prototype.calculateROAS = function() {
  if (this.spend > 0) {
    return Math.round((this.revenue / this.spend) * 100) / 100;
  }
  return 0;
};

Campaign.prototype.calculateROI = function() {
  if (this.spend > 0) {
    return Math.round(((this.revenue - this.spend) / this.spend * 100) * 100) / 100;
  }
  return 0;
};

Campaign.prototype.calculateCTR = function() {
  if (this.impressions > 0) {
    return Math.round((this.clicks / this.impressions * 100) * 100) / 100;
  }
  return 0;
};

Campaign.prototype.calculateCPC = function() {
  if (this.clicks > 0) {
    return Math.round((this.spend / this.clicks) * 100) / 100;
  }
  return 0;
};

Campaign.prototype.calculateConversionRate = function() {
  if (this.clicks > 0) {
    return Math.round((this.conversions / this.clicks * 100) * 100) / 100;
  }
  return 0;
};

  // Add error handling and retry logic for updates
  Campaign.prototype.safeUpdate = async function(updates, options = {}) {
    let retries = options.retries || 3;
    let delay = options.delay || 1000;

    while (retries > 0) {
      try {
        const result = await this.update(updates);
        return result;
      } catch (error) {
        retries--;
        if (retries === 0) throw error;
        
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      }
    }
  };

  // Class methods
  Campaign.getActiveCount = async function() {
    return await this.count({ where: { status: 'active' } });
  };

  Campaign.getTotalSpend = async function() {
    const result = await this.findAll({
      attributes: [[sequelize.fn('SUM', sequelize.col('spend')), 'totalSpend']]
    });
    return result[0].dataValues.totalSpend || 0;
  };

  Campaign.getTotalRevenue = async function() {
    const result = await this.findAll({
      attributes: [[sequelize.fn('SUM', sequelize.col('revenue')), 'totalRevenue']]
    });
    return result[0].dataValues.totalRevenue || 0;
  };

  Campaign.getChannelPerformance = async function() {
    return await this.findAll({
      attributes: [
        'channel',
        [sequelize.fn('COUNT', sequelize.col('id')), 'campaignCount'],
        [sequelize.fn('SUM', sequelize.col('spend')), 'totalSpend'],
        [sequelize.fn('SUM', sequelize.col('revenue')), 'totalRevenue'],
        [sequelize.fn('AVG', sequelize.col('roas')), 'avgROAS']
      ],
      group: ['channel'],
      order: [[sequelize.fn('SUM', sequelize.col('revenue')), 'DESC']]
    });
  };

  // Add method for real-time metrics update
  Campaign.updateMetrics = async function(campaignId, metrics, options = {}) {
    const transaction = await sequelize.transaction();
    
    try {
      const campaign = await this.findByPk(campaignId, { transaction });
      if (!campaign) {
        throw new Error(`Campaign with id ${campaignId} not found`);
      }

      await campaign.increment(metrics, { transaction });
      await campaign.reload({ transaction });

      // Recalculate derived metrics
      const updates = {
        ctr: campaign.calculateCTR(),
        cpc: campaign.calculateCPC(),
        conversion_rate: campaign.calculateConversionRate(),
        roas: campaign.calculateROAS(),
        roi: campaign.calculateROI(),
        last_updated_at: new Date()
      };

      await campaign.update(updates, { transaction });
      await transaction.commit();

      // Emit real-time update through WebSocket service
      if (global.wsService) {
        global.wsService.broadcast('campaignUpdate', {
          campaignId: campaign.id,
          metrics: metrics,
          campaign: campaign.toJSON()
        });
      }

      return campaign;
    } catch (error) {
      await transaction.rollback();
      console.error('Error updating campaign metrics:', error);
      
      if (options.retries > 0) {
        return await this.updateMetrics(campaignId, metrics, {
          ...options,
          retries: options.retries - 1
        });
      }
      
      throw error;
    }
  };

  // Add method to get campaign updates in a time range
  Campaign.getCampaignUpdates = async function(campaignId, startDate, endDate) {
    return await sequelize.models.CampaignMetricsHistory.findAll({
      where: {
        campaign_id: campaignId,
        metrics_date: {
          [Op.between]: [startDate, endDate]
        }
      },
      order: [['metrics_date', 'ASC']],
      include: [{
        model: sequelize.models.Campaign,
        as: 'campaign',
        attributes: ['campaign_name', 'channel', 'status']
      }]
    });
  };

module.exports = Campaign;