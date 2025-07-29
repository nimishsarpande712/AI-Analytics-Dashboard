import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ChartBarIcon, 
  HomeIcon, 
  DocumentChartBarIcon, 
  ChartPieIcon,
  CogIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: HomeIcon, path: '/' },
    { name: 'Analytics', icon: ChartBarIcon, path: '/analytics' },
    { name: 'Data Visualization', icon: ChartPieIcon, path: '/visualization' },
    { name: 'Reports', icon: DocumentChartBarIcon, path: '/reports' },
    { name: 'Settings', icon: CogIcon, path: '/settings' },
  ];

  return (
    <div className={`bg-gray-800 text-white transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} min-h-screen`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-8">
          {!isCollapsed && <h2 className="text-xl font-bold">AI Analytics</h2>}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            {isCollapsed ? <Bars3Icon className="w-5 h-5" /> : <XMarkIcon className="w-5 h-5" />}
          </button>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
