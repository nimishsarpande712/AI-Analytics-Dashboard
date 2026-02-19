import axios from 'axios';
import { io } from 'socket.io-client';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response.data);
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// WebSocket service for real-time updates
class WebSocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect() {
    if (this.socket && this.socket.connected) {
      console.log('WebSocket already connected:', this.socket.id);
      return this.socket;
    }

    this.socket = io('http://localhost:5001', {
      transports: ['websocket', 'polling'],
      timeout: 5000,
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      randomizationFactor: 0.5
    });

    this.setupSocketHandlers();
    return this.socket;
  }

  setupSocketHandlers() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('WebSocket connected:', this.socket.id);
      this.reconnectAttempts = 0;
      
      // Subscribe to real-time updates
      this.socket.emit('subscribe', { 
        events: ['metricsUpdate', 'campaignUpdate', 'analyticsUpdate'],
        interval: 60000 // Update every minute
      });

      this.notifyListeners('connectionStatus', { 
        status: 'connected', 
        socketId: this.socket.id 
      });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      this.notifyListeners('connectionStatus', { 
        status: 'disconnected', 
        reason,
        willReconnect: reason === 'io server disconnect' ? false : true
      });

      if (reason === 'io server disconnect') {
        this.socket.connect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.reconnectAttempts++;
      
      this.notifyListeners('connectionStatus', { 
        status: 'error', 
        error: error.message,
        attempts: this.reconnectAttempts,
        maxAttempts: this.maxReconnectAttempts
      });

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        this.socket.disconnect();
        this.notifyListeners('connectionStatus', { 
          status: 'failed', 
          reason: 'Max reconnection attempts reached'
        });
      }
    });

    // Setup real-time update handlers
    this.socket.on('metricsUpdate', (data) => {
      try {
        console.log('Received real-time metrics update:', data);
        if (!data) throw new Error('No metrics data received');
        this.notifyListeners('metricsUpdate', data);
      } catch (error) {
        console.error('Error processing metrics update:', error);
        this.notifyListeners('error', { type: 'metricsUpdate', error: error.message });
      }
    });

    this.socket.on('campaignUpdate', (data) => {
      try {
        console.log('Received campaign update:', data);
        if (!data) throw new Error('No campaign data received');
        this.notifyListeners('campaignUpdate', data);
      } catch (error) {
        console.error('Error processing campaign update:', error);
        this.notifyListeners('error', { type: 'campaignUpdate', error: error.message });
      }
    });

    this.socket.on('analyticsUpdate', (data) => {
      try {
        console.log('Received analytics update:', data);
        if (!data) throw new Error('No analytics data received');
        this.notifyListeners('analyticsUpdate', data);
      } catch (error) {
        console.error('Error processing analytics update:', error);
        this.notifyListeners('error', { type: 'analyticsUpdate', error: error.message });
      }
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.reconnectAttempts = 0;
      this.notifyListeners('connectionStatus', { status: 'disconnected', reason: 'manual' });
    }
  }

  subscribe(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
  }

  unsubscribe(event, callback) {
    if (this.listeners.has(event)) {
      const listeners = this.listeners.get(event);
      listeners.delete(callback);
      if (listeners.size === 0) {
        this.listeners.delete(event);
      }
    }
  }

  notifyListeners(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in listener for ${event}:`, error);
        }
      });
    }
  }

  emit(event, data) {
    if (this.socket && this.socket.connected) {
      this.socket.emit(event, data);
    }
  }

  isConnected() {
    return this.socket && this.socket.connected;
  }
}

// Create a singleton instance
const wsService = new WebSocketService();

// Create and export the API service
const apiService = {
  // HTTP Methods
  get: (url) => api.get(url),
  post: (url, data) => api.post(url, data),
  put: (url, data) => api.put(url, data),
  delete: (url) => api.delete(url),

  // WebSocket Methods
  initializeWebSocket: () => wsService.connect(),
  disconnectWebSocket: () => wsService.disconnect(),
  subscribeToWebSocketStatus: (callback) => wsService.subscribe('connectionStatus', callback),
  unsubscribeFromWebSocketStatus: (callback) => wsService.unsubscribe('connectionStatus', callback),
  subscribeToMetrics: (callback) => wsService.subscribe('metricsUpdate', callback),
  unsubscribeFromMetrics: (callback) => wsService.unsubscribe('metricsUpdate', callback),
  subscribeToAnalytics: (callback) => wsService.subscribe('analyticsUpdate', callback),
  unsubscribeFromAnalytics: (callback) => wsService.unsubscribe('analyticsUpdate', callback),

  // API Endpoints
  getCampaignMetrics: () => api.get('/dashboard/metrics'),
  getDashboardChartData: () => api.get('/dashboard/chart-data'),
  getCampaignAnalytics: () => api.get('/analytics/campaigns'),
  getRealtimeMetrics: () => api.get('/dashboard/realtime'),
  exportData: (data) => api.post('/dashboard/export', data),
  generateReport: (data) => api.post('/reports/generate', data),
  
  // DataVisualization endpoints
  getDashboards: () => api.get('/dashboards'),
  getChartData: (params) => api.get('/charts/data', { params }),
  importData: (data) => api.post('/data/import', data),
  createDashboard: (data) => api.post('/dashboards', data),
  exportChart: (data) => api.post('/charts/export', data),
  deleteDashboard: (id) => api.delete(`/dashboards/${id}`),
  
  // Reports endpoints
  getReports: () => api.get('/reports')
};

  // Initialize WebSocket connection on load
if (typeof window !== 'undefined') {
  setTimeout(() => {
    wsService.connect();
  }, 1000);
}

export { apiService };
