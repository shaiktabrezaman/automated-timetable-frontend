import React from 'react';

export default function Navbar({ activeTab, setActiveTab, onResetData }) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand-section">
          <div className="brand-icon">
            <span>📅</span>
          </div>
          <div className="brand-titles">
            <h1>Automated College Timetable System</h1>
            <p>Department Scheduling & Resource Optimization Portal</p>
          </div>
        </div>

        <nav className="nav-tabs">
          <button
            className={`nav-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <span>📊</span> Dashboard
          </button>
          <button
            className={`nav-tab-btn ${activeTab === 'manage' ? 'active' : ''}`}
            onClick={() => setActiveTab('manage')}
          >
            <span>⚙️</span> Manage Data
          </button>
          <button
            className={`nav-tab-btn ${activeTab === 'generator' ? 'active' : ''}`}
            onClick={() => setActiveTab('generator')}
          >
            <span>⚡</span> Timetable Generator
          </button>
          <button
            className={`nav-tab-btn ${activeTab === 'timetable' ? 'active' : ''}`}
            onClick={() => setActiveTab('timetable')}
          >
            <span>🗓️</span> Timetable View
          </button>
        </nav>

        <div className="nav-actions">
          {onResetData && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={onResetData}
              title="Refresh data from server"
            >
              ↺ Refresh Data
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
