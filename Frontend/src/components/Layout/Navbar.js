import React from 'react';
import { BellIcon, MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import './Layout.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <h1 className="navbar-title">AI Analytics Dashboard</h1>
        </div>
        
        <div className="navbar-right">
          {/* Search Bar */}
          <div style={{ position: 'relative' }}>
            <MagnifyingGlassIcon style={{ 
              position: 'absolute', 
              left: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              width: '20px', 
              height: '20px', 
              color: '#9ca3af' 
            }} />
            <input
              type="text"
              placeholder="Search..."
              style={{
                paddingLeft: '40px',
                paddingRight: '16px',
                paddingTop: '8px',
                paddingBottom: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>
          
          {/* Notifications */}
          <button className="icon-button" style={{ position: 'relative' }}>
            <BellIcon className="icon" />
            <span style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              backgroundColor: '#ef4444',
              color: 'white',
              fontSize: '12px',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              3
            </span>
          </button>
          
          {/* User Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserCircleIcon style={{ width: '32px', height: '32px', color: '#6b7280' }} />
            <div>
              <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>John Doe</p>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Admin</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
