const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const AuditLog = sequelize.define('AuditLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  table_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  record_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  action_type: {
    type: DataTypes.ENUM('INSERT', 'UPDATE', 'DELETE'),
    allowNull: false
  },
  old_values: {
    type: DataTypes.JSON,
    allowNull: true
  },
  new_values: {
    type: DataTypes.JSON,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'audit_log',
  timestamps: false,
  indexes: [
    {
      fields: ['table_name', 'record_id']
    },
    {
      fields: ['created_at']
    }
  ]
});

module.exports = AuditLog;
