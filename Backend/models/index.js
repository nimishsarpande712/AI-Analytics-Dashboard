const { Sequelize } = require('sequelize');
const { sequelize } = require('../config/db');
const Campaign = require('./Campaign');
const AuditLog = require('./AuditLog');
const CampaignMetricsHistory = require('./CampaignMetricsHistory');

// Define associations
Campaign.hasMany(CampaignMetricsHistory, {
  foreignKey: 'campaign_id',
  as: 'metricsHistory'
});

CampaignMetricsHistory.belongsTo(Campaign, {
  foreignKey: 'campaign_id',
  as: 'campaign'
});

// Add model hooks for real-time updates
Campaign.afterCreate(async (campaign, options) => {
  await AuditLog.create({
    table_name: 'Campaign',
    record_id: campaign.id,
    action_type: 'INSERT',
    new_values: campaign.toJSON()
  });
});

Campaign.afterUpdate(async (campaign, options) => {
  const changedFields = campaign.changed();
  if (changedFields) {
    const oldValues = {};
    const newValues = {};
    changedFields.forEach(field => {
      oldValues[field] = campaign.previous(field);
      newValues[field] = campaign.get(field);
    });

    await AuditLog.create({
      table_name: 'Campaign',
      record_id: campaign.id,
      action_type: 'UPDATE',
      old_values: oldValues,
      new_values: newValues
    });
  }
});

Campaign.afterDestroy(async (campaign, options) => {
  await AuditLog.create({
    table_name: 'Campaign',
    record_id: campaign.id,
    action_type: 'DELETE',
    old_values: campaign.toJSON()
  });
});

const models = {
  Campaign,
  AuditLog,
  CampaignMetricsHistory,
  sequelize
};

module.exports = models;
