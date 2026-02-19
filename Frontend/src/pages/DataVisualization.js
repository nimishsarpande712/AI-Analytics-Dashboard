import React, { useState, useEffect } from 'react';
import { ChartBarIcon, ChartPieIcon, PresentationChartLineIcon, PresentationChartBarIcon } from '@heroicons/react/24/outline';
import { apiService } from '../services/apiEnhanced';
import './DataVisualization.css';

const DataVisualization = () => {
  const [selectedChart, setSelectedChart] = useState('line');
  const [timeRange, setTimeRange] = useState('30days');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [dashboards, setDashboards] = useState([]);
  const [chartData, setChartData] = useState(null);

  const chartTemplates = [
    { id: 'line', name: 'Line Chart', icon: PresentationChartLineIcon },
    { id: 'bar', name: 'Bar Chart', icon: ChartBarIcon },
    { id: 'pie', name: 'Pie Chart', icon: ChartPieIcon },
    { id: 'area', name: 'Area Chart', icon: PresentationChartBarIcon },
  ];

  useEffect(() => {
    loadDashboards();
    loadChartData();
  }, [selectedChart, timeRange]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadDashboards = async () => {
    try {
      const response = await apiService.getDashboards();
      console.log('Dashboards loaded:', response.data);
      setDashboards(response.data || []);
    } catch (error) {
      console.error('Failed to load dashboards:', error);
      setDashboards([
        { id: 1, name: 'Sales Dashboard', type: 'revenue', lastUpdated: '2025-01-29' },
        { id: 2, name: 'User Analytics', type: 'users', lastUpdated: '2025-01-28' },
        { id: 3, name: 'Performance Metrics', type: 'performance', lastUpdated: '2025-01-27' }
      ]);
    }
  };

  const loadChartData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getChartData({
        chartType: selectedChart,
        timeRange: timeRange
      });
      console.log('Chart data loaded:', response.data);
      setChartData(response.data);
    } catch (error) {
      console.error('Failed to load chart data:', error);
      // Set mock data for visualization
      setChartData({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Sample Data',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: '#3b82f6'
        }]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImportData = async () => {
    try {
      setLoading(true);
      setMessage('Importing data...');
      
      // Simulate data import
      const importData = {
        source: 'csv',
        filename: 'sample_data.csv',
        mappings: {
          date: 'Date',
          value: 'Revenue',
          category: 'Product'
        }
      };
      
      const response = await apiService.importData(importData);
      console.log('Data imported:', response.data);
      
      setMessage('Data imported successfully!');
      setTimeout(() => setMessage(''), 3000);
      
      // Reload chart data
      await loadChartData();
    } catch (error) {
      console.error('Import failed:', error);
      setMessage('Import failed. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDashboard = async () => {
    try {
      setLoading(true);
      setMessage('Creating new dashboard...');
      
      const dashboardData = {
        name: `Dashboard - ${new Date().toLocaleDateString()}`,
        type: 'custom',
        charts: [{
          type: selectedChart,
          timeRange: timeRange,
          title: `${selectedChart.charAt(0).toUpperCase() + selectedChart.slice(1)} Chart`
        }],
        layout: 'grid'
      };
      
      const response = await apiService.createDashboard(dashboardData);
      console.log('Dashboard created:', response.data);
      
      const newDashboard = {
        id: Date.now(),
        name: dashboardData.name,
        type: 'custom',
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      
      setDashboards(prev => [newDashboard, ...prev]);
      setMessage('Dashboard created successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Dashboard creation failed:', error);
      setMessage('Dashboard creation failed. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleExportChart = async () => {
    try {
      setMessage('Exporting chart...');
      
      const exportData = {
        chartType: selectedChart,
        timeRange: timeRange,
        format: 'png'
      };
      
      const response = await apiService.exportChart(exportData);
      console.log('Chart exported:', response.data);
      
      // Simulate chart export
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 400;
      const ctx = canvas.getContext('2d');
      
      // Simple chart visualization
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(0, 0, 800, 400);
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(100, 50, 600, 300);
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px Arial';
      ctx.fillText(`${selectedChart.toUpperCase()} CHART - ${timeRange}`, 300, 220);
      
      canvas.toBlob((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedChart}_chart.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      });
      
      setMessage('Chart exported successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Export failed:', error);
      setMessage('Export failed. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDeleteDashboard = async (dashboardId, dashboardName) => {
    if (!window.confirm(`Are you sure you want to delete "${dashboardName}"?`)) {
      return;
    }
    
    try {
      setMessage(`Deleting ${dashboardName}...`);
      
      await apiService.deleteDashboard(dashboardId);
      setDashboards(prev => prev.filter(d => d.id !== dashboardId));
      setMessage('Dashboard deleted successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Delete failed:', error);
      setMessage('Delete failed. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="dataviz-container">
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
      
      <div className="dataviz-header">
        <h1 className="dataviz-title">Data Visualization</h1>
        <div className="dataviz-actions">
          <button 
            className="btn btn-secondary"
            onClick={handleImportData}
            disabled={loading}
          >
            {loading ? 'Importing...' : 'Import Data'}
          </button>
          <button 
            className="btn btn-primary"
            onClick={handleCreateDashboard}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Dashboard'}
          </button>
          <button 
            className="btn btn-secondary"
            onClick={handleExportChart}
            disabled={loading}
            style={{ marginLeft: '0.5rem' }}
          >
            {loading ? 'Exporting...' : 'Export Chart'}
          </button>
        </div>
      </div>

      {/* Chart Controls */}
      <div className="chart-controls">
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', margin: '0 0 1rem 0' }}>
          Chart Configuration
        </h3>
        <div className="controls-grid">
          <div className="control-group">
            <label className="control-label">Chart Type</label>
            <select 
              className="control-select"
              value={selectedChart}
              onChange={(e) => setSelectedChart(e.target.value)}
            >
              <option value="line">Line Chart</option>
              <option value="bar">Bar Chart</option>
              <option value="pie">Pie Chart</option>
              <option value="area">Area Chart</option>
            </select>
          </div>
          <div className="control-group">
            <label className="control-label">Time Range</label>
            <select 
              className="control-select"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
              <option value="1year">Last year</option>
            </select>
          </div>
          <div className="control-group">
            <label className="control-label">Data Source</label>
            <select className="control-select" onChange={(e) => {
              setMessage(`Data source changed to: ${e.target.value}`);
              setTimeout(() => setMessage(''), 2000);
            }}>
              <option value="analytics">Analytics Data</option>
              <option value="sales">Sales Data</option>
              <option value="user_activity">User Activity</option>
              <option value="revenue">Revenue Data</option>
            </select>
          </div>
          <div className="control-group">
            <button 
              className="btn btn-primary" 
              style={{ alignSelf: 'end' }}
              onClick={loadChartData}
              disabled={loading}
            >
              {loading ? 'Applying...' : 'Apply Filters'}
            </button>
          </div>
        </div>
      </div>

      {/* Chart Templates */}
      <div className="chart-templates">
        <div className="templates-header">
          <h3 className="templates-title">Quick Chart Templates</h3>
          <p className="templates-description">Choose a template to get started quickly</p>
        </div>
        <div className="templates-grid">
          {chartTemplates.map((template) => (
            <div 
              key={template.id} 
              className={`template-card ${selectedChart === template.id ? 'active' : ''}`}
              onClick={() => {
                setSelectedChart(template.id);
                setMessage(`Template changed to: ${template.name}`);
                setTimeout(() => setMessage(''), 2000);
              }}
              style={{ cursor: 'pointer' }}
            >
              <template.icon className="template-icon" />
              <span className="template-name">{template.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Existing Dashboards */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '0.75rem', 
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb',
        padding: '1.5rem',
        marginTop: '2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', margin: '0' }}>
            Existing Dashboards ({dashboards.length})
          </h3>
          <button 
            className="btn btn-secondary"
            onClick={loadDashboards}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {dashboards.map((dashboard) => (
            <div 
              key={dashboard.id}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                padding: '1rem',
                backgroundColor: '#f9fafb'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '500', color: '#1f2937', margin: '0' }}>
                  {dashboard.name}
                </h4>
                <button 
                  onClick={() => handleDeleteDashboard(dashboard.id, dashboard.name)}
                  style={{
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.25rem',
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.5rem 0' }}>
                Type: {dashboard.type} | Last Updated: {dashboard.lastUpdated}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  className="btn-small btn-outline"
                  onClick={() => {
                    setMessage(`Viewing ${dashboard.name}...`);
                    setTimeout(() => setMessage(''), 2000);
                  }}
                >
                  View
                </button>
                <button 
                  className="btn-small btn-primary"
                  onClick={() => {
                    setMessage(`Editing ${dashboard.name}...`);
                    setTimeout(() => setMessage(''), 2000);
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart Templates */}
      <div className="chart-templates">
        <div className="templates-header">
          <h3 className="templates-title">Quick Chart Templates</h3>
          <p className="templates-description">Choose a template to get started quickly</p>
        </div>
        <div className="templates-grid">
          {chartTemplates.map((template) => (
            <div 
              key={template.id} 
              className={`template-card ${selectedChart === template.id ? 'active' : ''}`}
              onClick={() => {
                setSelectedChart(template.id);
                setMessage(`Template changed to: ${template.name}`);
                setTimeout(() => setMessage(''), 2000);
              }}
              style={{ cursor: 'pointer' }}
            >
              <template.icon className="template-icon" />
              <span className="template-name">{template.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        <div className={`chart-card line-chart`}>
          <div className="chart-header">
            <h2 className="chart-title">Revenue Trend</h2>
            <div className="chart-options">
              <button className="chart-btn">⚙️</button>
              <button className="chart-btn">📊</button>
              <button className="chart-btn">⬇️</button>
            </div>
          </div>
          <div className="chart-content">
            {chartData ? (
              <div className="chart-data">
                {JSON.stringify(chartData, null, 2)}
              </div>
            ) : (
              <div className="chart-placeholder">
                <PresentationChartLineIcon className="chart-icon" />
                <p>Line Chart Component</p>
                <small>Interactive chart will render here</small>
              </div>
            )}
          </div>
        </div>
        
        <div className={`chart-card bar-chart`}>
          <div className="chart-header">
            <h2 className="chart-title">User Activity</h2>
            <div className="chart-options">
              <button className="chart-btn">⚙️</button>
              <button className="chart-btn">📊</button>
              <button className="chart-btn">⬇️</button>
            </div>
          </div>
          <div className="chart-content">
            <div className="chart-placeholder">
              <ChartBarIcon className="chart-icon" />
              <p>Bar Chart Component</p>
              <small>Interactive chart will render here</small>
            </div>
          </div>
        </div>
        
        <div className={`chart-card pie-chart`}>
          <div className="chart-header">
            <h2 className="chart-title">Traffic Sources</h2>
            <div className="chart-options">
              <button className="chart-btn">⚙️</button>
              <button className="chart-btn">📊</button>
              <button className="chart-btn">⬇️</button>
            </div>
          </div>
          <div className="chart-content">
            <div className="chart-placeholder">
              <ChartPieIcon className="chart-icon" />
              <p>Pie Chart Component</p>
              <small>Interactive chart will render here</small>
            </div>
          </div>
        </div>
        
        <div className={`chart-card area-chart`}>
          <div className="chart-header">
            <h2 className="chart-title">Conversion Funnel</h2>
            <div className="chart-options">
              <button className="chart-btn">⚙️</button>
              <button className="chart-btn">📊</button>
              <button className="chart-btn">⬇️</button>
            </div>
          </div>
          <div className="chart-content">
            <div className="chart-placeholder">
              <PresentationChartBarIcon className="chart-icon" />
              <p>Area Chart Component</p>
              <small>Interactive chart will render here</small>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Data Table */}
      <div className="data-table-section">
        <div className="table-header">
          <h2 className="table-title">Interactive Data Table</h2>
          <div className="table-controls">
            <input 
              type="text" 
              placeholder="Search data..." 
              className="table-search"
            />
            <button className="btn btn-outline btn-small">Filter</button>
            <button className="btn btn-outline btn-small">Export</button>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Users</th>
                <th>Revenue</th>
                <th>Conversion</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { date: '2025-07-25', users: 1200, revenue: 5400, conversion: 2.8 },
                { date: '2025-07-24', users: 1150, revenue: 5200, conversion: 2.6 },
                { date: '2025-07-23', users: 1300, revenue: 5800, conversion: 3.1 },
                { date: '2025-07-22', users: 1100, revenue: 4900, conversion: 2.4 },
                { date: '2025-07-21', users: 1250, revenue: 5600, conversion: 2.9 },
              ].map((row, index) => (
                <tr key={index}>
                  <td>{row.date}</td>
                  <td>{row.users.toLocaleString()}</td>
                  <td>${row.revenue.toLocaleString()}</td>
                  <td>{row.conversion}%</td>
                  <td>
                    <button className="chart-btn">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataVisualization;
