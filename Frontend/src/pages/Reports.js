import React, { useState, useEffect } from 'react';
import { DocumentTextIcon, CalendarIcon, ArrowDownTrayIcon, EyeIcon, TrashIcon } from '@heroicons/react/24/outline';
import { apiService } from '../services/apiEnhanced';
import './Reports.css';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const response = await apiService.getReports();
      console.log('Reports loaded:', response.data);
      
      // Ensure response.data is an array
      const reportData = Array.isArray(response.data) ? response.data : 
                        Array.isArray(response.data?.data) ? response.data.data : [];
      
      setReports(reportData);
      setMessage('Reports loaded successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Failed to load reports:', error);
      // Fallback to default data
      setReports([
        { 
          id: 1,
          name: 'Monthly Performance Report', 
          description: 'Comprehensive analysis of monthly KPIs and metrics',
          date: '2025-07-29', 
          status: 'published',
          type: 'performance'
        },
        { 
          id: 2,
          name: 'User Acquisition Report', 
          description: 'Analysis of user growth and acquisition channels',
          date: '2025-07-28', 
          status: 'published',
          type: 'users'
        },
        { 
          id: 3,
          name: 'Revenue Analysis', 
          description: 'Detailed breakdown of revenue streams and trends',
          date: '2025-07-27', 
          status: 'draft',
          type: 'revenue'
        },
        { 
          id: 4,
          name: 'Customer Behavior Report', 
          description: 'Insights into customer interactions and preferences',
          date: '2025-07-26', 
          status: 'scheduled',
          type: 'behavior'
        },
      ]);
      setMessage('Using offline data');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      setMessage('Generating new report...');
      
      const newReport = {
        type: 'custom',
        title: `Custom Report - ${new Date().toLocaleDateString()}`,
        dateRange: 'last_30_days',
        metrics: ['users', 'revenue', 'conversion']
      };
      
      const response = await apiService.generateReport(newReport);
      console.log('Report generated:', response.data);
      
      // Add new report to list
      const generatedReport = {
        id: Date.now(),
        name: newReport.title,
        description: 'Auto-generated custom report',
        date: new Date().toISOString().split('T')[0],
        status: 'published',
        type: 'performance'
      };
      
      setReports(prev => [generatedReport, ...prev]);
      setMessage('Report generated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Report generation failed:', error);
      setMessage('Report generation failed. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleReport = async () => {
    try {
      setMessage('Scheduling report...');
      
      const scheduleData = {
        type: 'weekly',
        time: '09:00',
        frequency: 'weekly',
        recipients: ['admin@company.com']
      };
      
      await apiService.scheduleReport(scheduleData);
      setMessage('Report scheduled successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Schedule failed:', error);
      setMessage('Schedule failed. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleQuickAction = async (actionType) => {
    try {
      setLoading(true);
      setMessage(`Generating ${actionType} report...`);
      
      let reportData = {};
      switch(actionType) {
        case 'daily':
          reportData = { type: 'daily', title: 'Daily Report', dateRange: 'today' };
          break;
        case 'weekly':
          reportData = { type: 'weekly', title: 'Weekly Digest', dateRange: 'last_7_days' };
          break;
        case 'custom':
          reportData = { type: 'custom', title: 'Custom Report', dateRange: 'custom' };
          break;
        default:
          reportData = { type: 'daily', title: 'Daily Report', dateRange: 'today' };
      }
      
      const response = await apiService.generateReport(reportData);
      console.log('Quick action report generated:', response.data);
      
      const newReport = {
        id: Date.now(),
        name: reportData.title,
        description: `Auto-generated ${actionType} report`,
        date: new Date().toISOString().split('T')[0],
        status: 'published',
        type: 'performance'
      };
      
      setReports(prev => [newReport, ...prev]);
      setMessage(`${actionType.charAt(0).toUpperCase() + actionType.slice(1)} report generated successfully!`);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Quick action failed:', error);
      setMessage('Quick action failed. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleViewReport = (report) => {
    setMessage(`Viewing ${report.name}...`);
    console.log('Viewing report:', report);
    // In a real app, this would open a modal or navigate to report details
    setTimeout(() => setMessage(''), 2000);
  };

  const handleDownloadReport = async (report) => {
    try {
      setMessage(`Downloading ${report.name}...`);
      
      const response = await apiService.downloadReport(report.id);
      console.log('Download response:', response.data);
      
      // Simulate file download
      const blob = new Blob([`Report: ${report.name}\nDescription: ${report.description}\nGenerated: ${report.date}\n\nReport Content:\n- Executive Summary\n- Key Metrics\n- Detailed Analysis\n- Recommendations`], 
        { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.name.replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      setMessage('Download completed!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Download failed:', error);
      setMessage('Download failed. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleShareReport = (report) => {
    setMessage(`Sharing ${report.name}...`);
    // In a real app, this would open a share modal
    console.log('Sharing report:', report);
    setTimeout(() => setMessage(''), 2000);
  };

  const handleDeleteReport = async (report) => {
    if (!window.confirm(`Are you sure you want to delete "${report.name}"?`)) {
      return;
    }
    
    try {
      setMessage(`Deleting ${report.name}...`);
      
      await apiService.deleteReport(report.id);
      setReports(prev => prev.filter(r => r.id !== report.id));
      setMessage('Report deleted successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Delete failed:', error);
      setMessage('Delete failed. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Filter reports based on active tab and search term
  const filteredReports = Array.isArray(reports) ? reports.filter(report => {
    const matchesTab = activeTab === 'all' || report.type === activeTab;
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  }) : [];

  // Pagination
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReports = filteredReports.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setMessage(`Showing page ${page} of ${totalPages}`);
    setTimeout(() => setMessage(''), 2000);
  };

  return (
    <div className="reports-container">
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
      
      <div className="reports-header">
        <h1 className="reports-title">Reports</h1>
        <div className="reports-actions">
          <input 
            type="text" 
            placeholder="Search reports..." 
            className="search-bar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button 
            className="btn btn-secondary"
            onClick={handleGenerateReport}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
          <button 
            className="btn btn-primary"
            onClick={handleScheduleReport}
            disabled={loading}
          >
            {loading ? 'Scheduling...' : 'Schedule Report'}
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          <div 
            className="action-button"
            onClick={() => handleQuickAction('daily')}
            style={{ cursor: 'pointer' }}
          >
            <DocumentTextIcon className="action-icon" />
            <div>
              <div className="action-text">Daily Report</div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Generate today's summary</div>
            </div>
          </div>
          <div 
            className="action-button"
            onClick={() => handleQuickAction('weekly')}
            style={{ cursor: 'pointer' }}
          >
            <CalendarIcon className="action-icon" />
            <div>
              <div className="action-text">Weekly Digest</div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Last 7 days overview</div>
            </div>
          </div>
          <div 
            className="action-button"
            onClick={() => handleQuickAction('custom')}
            style={{ cursor: 'pointer' }}
          >
            <ArrowDownTrayIcon className="action-icon" />
            <div>
              <div className="action-text">Custom Report</div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Build your own report</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <div className="tabs-list">
          <button 
            className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Reports ({Array.isArray(reports) ? reports.length : 0})
          </button>
          <button 
            className={`tab-button ${activeTab === 'performance' ? 'active' : ''}`}
            onClick={() => setActiveTab('performance')}
          >
            Performance ({Array.isArray(reports) ? reports.filter(r => r.type === 'performance').length : 0})
          </button>
          <button 
            className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            User Analytics ({Array.isArray(reports) ? reports.filter(r => r.type === 'users').length : 0})
          </button>
          <button 
            className={`tab-button ${activeTab === 'revenue' ? 'active' : ''}`}
            onClick={() => setActiveTab('revenue')}
          >
            Revenue ({Array.isArray(reports) ? reports.filter(r => r.type === 'revenue').length : 0})
          </button>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="reports-grid">
        {paginatedReports.map((report) => (
          <div key={report.id} className="report-card">
            <div className="report-card-header">
              <h3 className="report-title">{report.name}</h3>
              <p className="report-description">{report.description}</p>
            </div>
            <div className="report-card-content">
              <div className="report-meta">
                <div className="meta-item">
                  <CalendarIcon className="w-3 h-3" />
                  <span>{report.date}</span>
                </div>
                <span className={`status-badge ${report.status}`}>
                  {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                </span>
              </div>
              <div className="report-preview">
                <p>Report preview: Key insights and metrics overview</p>
              </div>
              <div className="report-actions">
                <button 
                  className="btn-small btn-outline"
                  onClick={() => handleViewReport(report)}
                  title="View Report"
                >
                  <EyeIcon className="w-4 h-4" />
                  View
                </button>
                {report.status === 'published' && (
                  <button 
                    className="btn-small btn-primary"
                    onClick={() => handleDownloadReport(report)}
                    title="Download Report"
                  >
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    Download
                  </button>
                )}
                <button 
                  className="btn-small btn-outline"
                  onClick={() => handleShareReport(report)}
                  title="Share Report"
                >
                  Share
                </button>
                <button 
                  className="btn-small btn-danger"
                  onClick={() => handleDeleteReport(report)}
                  title="Delete Report"
                  style={{ backgroundColor: '#ef4444', color: 'white', border: 'none' }}
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '0.5rem', 
          marginTop: '2rem' 
        }}>
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              backgroundColor: currentPage === 1 ? '#f9fafb' : 'white',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                backgroundColor: page === currentPage ? '#3b82f6' : 'white',
                color: page === currentPage ? 'white' : '#374151',
                cursor: 'pointer'
              }}
            >
              {page}
            </button>
          ))}
          
          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              backgroundColor: currentPage === totalPages ? '#f9fafb' : 'white',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
            }}
          >
            Next
          </button>
        </div>
      )}

      {/* Report Summary */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '0.75rem', 
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb',
        padding: '1.5rem',
        marginTop: '2rem'
      }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', margin: '0 0 1rem 0' }}>
          Latest Report Summary
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ borderLeft: '4px solid #3b82f6', paddingLeft: '1rem' }}>
            <h3 style={{ fontWeight: '500', color: '#1f2937', margin: '0' }}>Executive Summary</h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>
              This month showed significant growth across all key metrics with user acquisition up 25% and revenue increasing by 18%.
            </p>
          </div>
          <div style={{ borderLeft: '4px solid #10b981', paddingLeft: '1rem' }}>
            <h3 style={{ fontWeight: '500', color: '#1f2937', margin: '0' }}>Key Achievements</h3>
            <ul style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0 0', paddingLeft: '1rem' }}>
              <li>Exceeded monthly revenue target by 15%</li>
              <li>Improved customer satisfaction score to 4.8/5</li>
              <li>Reduced churn rate by 12%</li>
            </ul>
          </div>
          <div style={{ borderLeft: '4px solid #f59e0b', paddingLeft: '1rem' }}>
            <h3 style={{ fontWeight: '500', color: '#1f2937', margin: '0' }}>Areas for Improvement</h3>
            <ul style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0 0', paddingLeft: '1rem' }}>
              <li>Mobile conversion rate needs optimization</li>
              <li>Customer acquisition cost trending upward</li>
              <li>Support response time above target</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
