import React, { useState, useEffect } from 'react';
import { UserIcon } from '@heroicons/react/24/outline';
import { apiService } from '../services/apiEnhanced';
import './Settings.css';

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [dataSources, setDataSources] = useState([]);
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState({
    predictiveAnalytics: true,
    anomalyDetection: true,
    autoInsights: false,
    emailReports: true,
    pushNotifications: false,
    smsAlerts: true
  });

  useEffect(() => {
    const fetchDataSources = async () => {
      try {
        setLoading(true);
        const response = await apiService.getDataSources();
        setDataSources(response.data.data || []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch data sources:', err);
        setError('Unable to load data sources. Using offline data.');
        // Provide fallback data
        setDataSources([
          {
            id: 1,
            name: 'Google Analytics',
            status: 'Connected',
            color: 'green',
            description: 'Website analytics data'
          },
          {
            id: 2,
            name: 'Database',
            status: 'Connected',
            color: 'green',
            description: 'Internal database'
          },
          {
            id: 3,
            name: 'External API',
            status: 'Disconnected',
            color: 'red',
            description: 'Third-party data source'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDataSources();
  }, []);

  const handleToggle = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1 className="settings-title">Settings</h1>
        <div className="settings-actions">
          <button className="btn btn-secondary">Reset to Default</button>
          <button className="btn btn-primary">Save Changes</button>
        </div>
      </div>

      <div className="settings-grid">
        {/* Profile Section */}
        <div className="settings-section">
          <div className="section-header">
            <h2 className="section-title">Profile Settings</h2>
            <p className="section-description">Manage your account information and preferences</p>
          </div>
          <div className="section-content">
            <div className="profile-section">
              <div className="profile-avatar">
                <UserIcon className="w-8 h-8" />
              </div>
              <div className="profile-info">
                <h3 className="profile-name">John Doe</h3>
                <p className="profile-email">john.doe@company.com</p>
              </div>
              <div className="profile-actions">
                <button className="btn-small btn-outline">Edit</button>
              </div>
            </div>
            
            <div className="two-column">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-input" defaultValue="John Doe" />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-input" defaultValue="john.doe@company.com" />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Bio</label>
              <textarea className="form-textarea" placeholder="Tell us about yourself..."></textarea>
            </div>
          </div>
        </div>

        {/* General Settings */}
        <div className="settings-section">
          <div className="section-header">
            <h2 className="section-title">General Settings</h2>
            <p className="section-description">Configure dashboard preferences and defaults</p>
          </div>
          <div className="section-content">
            <div className="two-column">
              <div className="form-group">
                <label className="form-label">Dashboard Name</label>
                <input type="text" className="form-input" defaultValue="AI Analytics Dashboard" />
              </div>
              <div className="form-group">
                <label className="form-label">Default Time Range</label>
                <select className="form-select">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                  <option>Last year</option>
                </select>
              </div>
            </div>
            
            <div className="two-column">
              <div className="form-group">
                <label className="form-label">Timezone</label>
                <select className="form-select">
                  <option>UTC</option>
                  <option>America/New_York</option>
                  <option>America/Los_Angeles</option>
                  <option>Europe/London</option>
                  <option>Asia/Tokyo</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Currency</label>
                <select className="form-select">
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                  <option>GBP (£)</option>
                  <option>JPY (¥)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Data Sources */}
        <div className="settings-section">
          <div className="section-header">
            <h2 className="section-title">Data Sources</h2>
            <p className="section-description">Manage your connected data sources and integrations</p>
          </div>
          <div className="section-content">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>Loading...</div>
            ) : error ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#ef4444' }}>{error}</div>
            ) : (
              dataSources.map((source, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  marginBottom: '1rem'
                }}>
                  <div>
                    <h3 style={{ fontWeight: '500', color: '#1f2937', margin: '0' }}>{source.name}</h3>
                    <p style={{ 
                      fontSize: '0.875rem', 
                      color: source.color === 'green' ? '#10b981' : '#ef4444',
                      margin: '0.25rem 0 0 0'
                    }}>
                      {source.status}
                    </p>
                  </div>
                  <button className="btn-small btn-outline">
                    {source.status === 'Connected' ? 'Configure' : 'Connect'}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* AI Configuration */}
        <div className="settings-section">
          <div className="section-header">
            <h2 className="section-title">AI Configuration</h2>
            <p className="section-description">Configure AI-powered features and analytics</p>
          </div>
          <div className="section-content">
            <div className="toggle-container">
              <div className="toggle-info">
                <h3 className="toggle-title">Predictive Analytics</h3>
                <p className="toggle-description">Enable AI-powered predictions and forecasting</p>
              </div>
              <div 
                className={`toggle-switch ${settings.predictiveAnalytics ? 'active' : ''}`}
                onClick={() => handleToggle('predictiveAnalytics')}
              >
                <div className="toggle-slider"></div>
              </div>
            </div>

            <div className="toggle-container">
              <div className="toggle-info">
                <h3 className="toggle-title">Anomaly Detection</h3>
                <p className="toggle-description">Automatically detect unusual patterns in your data</p>
              </div>
              <div 
                className={`toggle-switch ${settings.anomalyDetection ? 'active' : ''}`}
                onClick={() => handleToggle('anomalyDetection')}
              >
                <div className="toggle-slider"></div>
              </div>
            </div>

            <div className="toggle-container">
              <div className="toggle-info">
                <h3 className="toggle-title">Auto-generated Insights</h3>
                <p className="toggle-description">Generate insights and recommendations automatically</p>
              </div>
              <div 
                className={`toggle-switch ${settings.autoInsights ? 'active' : ''}`}
                onClick={() => handleToggle('autoInsights')}
              >
                <div className="toggle-slider"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="settings-section">
          <div className="section-header">
            <h2 className="section-title">Notifications</h2>
            <p className="section-description">Manage how you receive updates and alerts</p>
          </div>
          <div className="section-content">
            <div className="toggle-container">
              <div className="toggle-info">
                <h3 className="toggle-title">Email Reports</h3>
                <p className="toggle-description">Receive automated reports via email</p>
              </div>
              <div 
                className={`toggle-switch ${settings.emailReports ? 'active' : ''}`}
                onClick={() => handleToggle('emailReports')}
              >
                <div className="toggle-slider"></div>
              </div>
            </div>

            <div className="toggle-container">
              <div className="toggle-info">
                <h3 className="toggle-title">Push Notifications</h3>
                <p className="toggle-description">Get real-time notifications in your browser</p>
              </div>
              <div 
                className={`toggle-switch ${settings.pushNotifications ? 'active' : ''}`}
                onClick={() => handleToggle('pushNotifications')}
              >
                <div className="toggle-slider"></div>
              </div>
            </div>

            <div className="toggle-container">
              <div className="toggle-info">
                <h3 className="toggle-title">SMS Alerts</h3>
                <p className="toggle-description">Receive critical alerts via SMS</p>
              </div>
              <div 
                className={`toggle-switch ${settings.smsAlerts ? 'active' : ''}`}
                onClick={() => handleToggle('smsAlerts')}
              >
                <div className="toggle-slider"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
