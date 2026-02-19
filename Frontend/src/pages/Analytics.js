import React, { useState, useEffect } from 'react';
import { ChartBarIcon, ArrowTrendingUpIcon, UsersIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { apiService } from '../services/apiEnhanced';
import './Analytics.css';

const Analytics = () => {
  const [metrics, setMetrics] = useState([
    { name: 'Page Views', value: '24,892', change: '+12.5%', trend: 'positive', icon: ChartBarIcon },
    { name: 'Unique Visitors', value: '18,234', change: '+8.2%', trend: 'positive', icon: UsersIcon },
    { name: 'Conversion Rate', value: '3.24%', change: '-2.1%', trend: 'negative', icon: ArrowTrendingUpIcon },
    { name: 'Revenue', value: '$45,231', change: '+15.3%', trend: 'positive', icon: CurrencyDollarIcon },
  ]);
  
  const [filters, setFilters] = useState({
    dateRange: 'last_7_days',
    campaign: 'all',
    trafficSource: 'all',
    device: 'all'
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadAnalyticsData();
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAnalytics(filters);
      console.log('Analytics data loaded:', response.data);
      
      // Update metrics with real data if available
      if (response.data.metrics) {
        setMetrics(response.data.metrics);
      }
      
      setMessage('Analytics data loaded successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Failed to load analytics:', error);
      setMessage('Using offline data');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = async () => {
    try {
      setLoading(true);
      setMessage('Exporting analytics report...');
      
      const exportData = {
        type: 'analytics',
        format: 'csv',
        dateRange: filters.dateRange,
        filters: filters
      };
      
      const response = await apiService.exportData(exportData);
      console.log('Export response:', response.data);
      
      // Simulate file download
      const csvContent = `Metric,Value,Change,Trend\n${metrics.map(m => 
        `${m.name},${m.value},${m.change},${m.trend}`
      ).join('\n')}`;
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'analytics_report.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      setMessage('Analytics report exported successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Export failed:', error);
      setMessage('Export failed. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setMessage(`Filter updated: ${filterName} = ${value}`);
    setTimeout(() => setMessage(''), 2000);
  };

  const handleApplyFilters = async () => {
    try {
      setMessage('Applying filters...');
      await loadAnalyticsData();
    } catch (error) {
      console.error('Filter application failed:', error);
      setMessage('Filter application failed. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleResetFilters = () => {
    const defaultFilters = {
      dateRange: 'last_7_days',
      campaign: 'all',
      trafficSource: 'all',
      device: 'all'
    };
    setFilters(defaultFilters);
    setMessage('Filters reset to default');
    setTimeout(() => setMessage(''), 2000);
  };

  return (
    <div className="analytics-container">
      {message && (
        <div style={{
          padding: '0.75rem 1rem',
          marginBottom: '1rem',
          backgroundColor: message.includes('failed') ? '#fee2e2' : '#d1fae5',
          color: message.includes('failed') ? '#dc2626' : '#065f46',
          borderRadius: '0.5rem',
          fontSize: '0.875rem'
        }}>
          {message}
        </div>
      )}
      
      <div className="analytics-header">
        <h1 className="analytics-title">Analytics</h1>
        <div className="analytics-actions">
          <div className="date-range-picker">
            <select 
              className="filter-select"
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            >
              <option value="last_7_days">Last 7 days</option>
              <option value="last_30_days">Last 30 days</option>
              <option value="last_90_days">Last 90 days</option>
            </select>
          </div>
          <button 
            className="btn btn-primary" 
            onClick={handleExportReport}
            disabled={loading}
          >
            {loading ? 'Exporting...' : 'Export Report'}
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <h3>Filters</h3>
        <div className="filter-grid">
          <div className="filter-group">
            <label className="filter-label">Campaign</label>
            <select 
              className="filter-select"
              value={filters.campaign}
              onChange={(e) => handleFilterChange('campaign', e.target.value)}
            >
              <option value="all">All Campaigns</option>
              <option value="summer_sale">Summer Sale</option>
              <option value="holiday_promo">Holiday Promo</option>
              <option value="back_to_school">Back to School</option>
            </select>
          </div>
          <div className="filter-group">
            <label className="filter-label">Traffic Source</label>
            <select 
              className="filter-select"
              value={filters.trafficSource}
              onChange={(e) => handleFilterChange('trafficSource', e.target.value)}
            >
              <option value="all">All Sources</option>
              <option value="organic">Organic</option>
              <option value="paid">Paid</option>
              <option value="social">Social</option>
              <option value="email">Email</option>
              <option value="direct">Direct</option>
            </select>
          </div>
          <div className="filter-group">
            <label className="filter-label">Device Type</label>
            <select 
              className="filter-select"
              value={filters.device}
              onChange={(e) => handleFilterChange('device', e.target.value)}
            >
              <option value="all">All Devices</option>
              <option value="desktop">Desktop</option>
              <option value="mobile">Mobile</option>
              <option value="tablet">Tablet</option>
            </select>
          </div>
        </div>
        <div className="filter-actions" style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
          <button 
            className="btn btn-primary"
            onClick={handleApplyFilters}
            disabled={loading}
          >
            {loading ? 'Applying...' : 'Apply Filters'}
          </button>
          <button 
            className="btn btn-secondary"
            onClick={handleResetFilters}
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="metrics-grid">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.name} className="metric-card">
              <div className="metric-card-header">
                <h3 className="metric-title">{metric.name}</h3>
                <Icon className="metric-icon w-5 h-5" />
              </div>
              <p className="metric-value">{metric.value}</p>
              <div className={`metric-change ${metric.trend}`}>
                {metric.trend === 'positive' ? '↗' : '↘'} {metric.change}
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="main-chart">
          <h2 className="chart-title">Performance Metrics</h2>
          <div className="chart-placeholder">
            <p>Advanced Analytics Chart will be rendered here</p>
          </div>
        </div>
        
        <div className="side-charts">
          <div className="side-chart">
            <h3 className="chart-title">Key Insights</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ padding: '1rem', backgroundColor: '#dbeafe', borderRadius: '0.5rem' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1e3a8a', margin: '0' }}>Traffic Increase</p>
                <p style={{ fontSize: '0.75rem', color: '#1d4ed8', margin: '0.25rem 0 0 0' }}>25% increase in organic traffic</p>
              </div>
              <div style={{ padding: '1rem', backgroundColor: '#d1fae5', borderRadius: '0.5rem' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#065f46', margin: '0' }}>Conversion Rate</p>
                <p style={{ fontSize: '0.75rem', color: '#047857', margin: '0.25rem 0 0 0' }}>8% improvement in conversions</p>
              </div>
              <div style={{ padding: '1rem', backgroundColor: '#e9d5ff', borderRadius: '0.5rem' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#581c87', margin: '0' }}>User Engagement</p>
                <p style={{ fontSize: '0.75rem', color: '#7c3aed', margin: '0.25rem 0 0 0' }}>15% longer session duration</p>
              </div>
            </div>
          </div>
          
          <div className="side-chart">
            <h3 className="chart-title">AI Predictions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Next Week Revenue</span>
                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937' }}>$52,000</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Expected Users</span>
                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937' }}>14,200</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Churn Risk</span>
                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#ef4444' }}>Low (2.1%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="data-table-container">
        <div className="table-header">
          <h2 className="table-title">Detailed Analytics</h2>
          <input type="text" placeholder="Search..." className="table-search" />
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Page</th>
              <th>Views</th>
              <th>Unique Visitors</th>
              <th>Bounce Rate</th>
              <th>Avg. Time</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>/dashboard</td>
              <td>5,234</td>
              <td>4,123</td>
              <td>23.5%</td>
              <td>2m 34s</td>
            </tr>
            <tr>
              <td>/analytics</td>
              <td>3,892</td>
              <td>3,234</td>
              <td>18.2%</td>
              <td>3m 12s</td>
            </tr>
            <tr>
              <td>/reports</td>
              <td>2,456</td>
              <td>2,123</td>
              <td>25.8%</td>
              <td>1m 58s</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Analytics;
