import React from 'react';

const Analytics = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <div className="flex space-x-3">
          <select className="px-4 py-2 text-sm border border-gray-300 rounded-md">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h2>
          <div className="h-80 bg-gray-100 rounded flex items-center justify-center">
            <p className="text-gray-500">Advanced Analytics Chart will be rendered here</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-900">Traffic Increase</p>
                <p className="text-xs text-blue-700">25% increase in organic traffic</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-green-900">Conversion Rate</p>
                <p className="text-xs text-green-700">8% improvement in conversions</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm font-medium text-purple-900">User Engagement</p>
                <p className="text-xs text-purple-700">15% longer session duration</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Predictions</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Next Week Revenue</span>
                <span className="text-sm font-semibold text-gray-900">$52,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Expected Users</span>
                <span className="text-sm font-semibold text-gray-900">14,200</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Churn Risk</span>
                <span className="text-sm font-semibold text-red-600">Low (2.1%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
