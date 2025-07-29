import React from 'react';

const Reports = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        <div className="flex space-x-3">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            Generate Report
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
            Schedule Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Performance Report</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-medium text-gray-900">Executive Summary</h3>
                <p className="text-sm text-gray-600 mt-1">
                  This month showed significant growth across all key metrics with user acquisition up 25% and revenue increasing by 18%.
                </p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-medium text-gray-900">Key Achievements</h3>
                <ul className="text-sm text-gray-600 mt-1 space-y-1">
                  <li>• Exceeded monthly revenue target by 15%</li>
                  <li>• Improved customer satisfaction score to 4.8/5</li>
                  <li>• Reduced churn rate by 12%</li>
                </ul>
              </div>
              <div className="border-l-4 border-yellow-500 pl-4">
                <h3 className="font-medium text-gray-900">Areas for Improvement</h3>
                <ul className="text-sm text-gray-600 mt-1 space-y-1">
                  <li>• Mobile conversion rate needs optimization</li>
                  <li>• Customer acquisition cost trending upward</li>
                  <li>• Support response time above target</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Reports</h2>
            <div className="space-y-3">
              {[
                { name: 'User Acquisition Report', date: '2025-07-29', status: 'Ready' },
                { name: 'Revenue Analysis', date: '2025-07-28', status: 'Processing' },
                { name: 'Customer Behavior Report', date: '2025-07-27', status: 'Ready' },
                { name: 'Marketing Campaign Analysis', date: '2025-07-26', status: 'Ready' },
              ].map((report, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{report.name}</h3>
                    <p className="text-sm text-gray-500">Generated on {report.date}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      report.status === 'Ready' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {report.status}
                    </span>
                    {report.status === 'Ready' && (
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Download
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="font-medium text-gray-900">Daily Report</div>
                <div className="text-sm text-gray-500">Generate today's summary</div>
              </button>
              <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="font-medium text-gray-900">Weekly Digest</div>
                <div className="text-sm text-gray-500">Last 7 days overview</div>
              </button>
              <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="font-medium text-gray-900">Custom Report</div>
                <div className="text-sm text-gray-500">Build your own report</div>
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Scheduled Reports</h3>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="font-medium text-blue-900">Weekly Summary</div>
                <div className="text-sm text-blue-700">Every Monday at 9:00 AM</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="font-medium text-green-900">Monthly Report</div>
                <div className="text-sm text-green-700">1st of every month</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
