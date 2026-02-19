import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  // Auth endpoints
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    me: '/auth/me',
  },
  // Campaign endpoints
  campaigns: {
    list: '/campaigns',
    metrics: '/campaigns/metrics',
    chartData: '/campaigns/chart-data',
    summary: '/campaigns/summary',
    channelPerformance: '/campaigns/channels/performance',
  },
  // Analytics endpoints
  analytics: {
    overview: '/analytics',
    metrics: (metric) => `/analytics/${metric}`,
  },
  // Reports endpoints
  reports: {
    list: '/reports',
    generate: '/reports/generate',
    download: (id) => `/reports/${id}/download`,
    scheduled: '/reports/scheduled/list',
  },
  // Data endpoints
  data: {
    sources: '/data/sources',
    upload: '/data/upload',
    export: '/data/export',
    visualization: '/data/visualization',
    sync: (sourceId) => `/data/sync/${sourceId}`,
  },
};

// API methods
export const apiService = {
  // Campaigns
  getCampaigns: (params) => api.get(endpoints.campaigns.list, { params }),
  getCampaignMetrics: () => api.get(endpoints.campaigns.metrics),
  getCampaignChartData: (params) => api.get(endpoints.campaigns.chartData, { params }),
  getCampaignSummary: () => api.get(endpoints.campaigns.summary),
  getChannelPerformance: () => api.get(endpoints.campaigns.channelPerformance),

  // Analytics
  getAnalyticsOverview: (params) => api.get(endpoints.analytics.overview, { params }),
  getAnalyticsMetric: (metric, params) => api.get(endpoints.analytics.metrics(metric), { params }),

  // Reports
  getReports: () => api.get(endpoints.reports.list),
  generateReport: (data) => api.post(endpoints.reports.generate, data),
  downloadReport: (id) => api.get(endpoints.reports.download(id)),
  getScheduledReports: () => api.get(endpoints.reports.scheduled),

  // Data Sources
  getDataSources: () => api.get(endpoints.data.sources),
  uploadData: (data) => api.post(endpoints.data.upload, data),
  exportData: (params) => api.get(endpoints.data.export, { params }),
  getVisualizationData: (params) => api.get(endpoints.data.visualization, { params }),
  syncDataSource: (sourceId) => api.post(endpoints.data.sync(sourceId)),
};

export default apiService;
