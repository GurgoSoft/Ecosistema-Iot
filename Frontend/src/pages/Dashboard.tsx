import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { Device, DeviceType, DeviceStatus } from '../types';
import DevicesPage from './DevicesPage';
import AnalyticsPage from './AnalyticsPage';
import AlertsPage from './AlertsPage';
import SettingsPage from './SettingsPage';
import GrafanaPanel from '../components/GrafanaPanel';

interface DashboardProps {
  onLogout?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [devices, setDevices] = useState<Device[]>([]);

  // Datos de ejemplo
  useEffect(() => {
    const mockDevices: Device[] = [
      {
        id: '1',
        name: 'Temperature Sensor 001',
        type: DeviceType.SENSOR,
        status: DeviceStatus.ONLINE,
        location: 'Main Hall',
        lastUpdate: new Date(),
        data: { temperature: 22.5, humidity: 45 }
      },
      {
        id: '2',
        name: 'Light Actuator 002',
        type: DeviceType.ACTUATOR,
        status: DeviceStatus.ONLINE,
        location: 'Office',
        lastUpdate: new Date(Date.now() - 300000),
        data: { state: 'on', brightness: 80 }
      },
      {
        id: '3',
        name: 'Main Gateway',
        type: DeviceType.GATEWAY,
        status: DeviceStatus.ERROR,
        location: 'Data Center',
        lastUpdate: new Date(Date.now() - 600000),
      },
      {
        id: '4',
        name: 'Humidity Sensor 003',
        type: DeviceType.SENSOR,
        status: DeviceStatus.ONLINE,
        location: 'Warehouse',
        lastUpdate: new Date(Date.now() - 120000),
        data: { humidity: 60 }
      }
    ];
    setDevices(mockDevices);
  }, []);

  const getStatusCounts = () => {
    return {
      online: devices.filter(d => d.status === DeviceStatus.ONLINE).length,
      offline: devices.filter(d => d.status === DeviceStatus.OFFLINE).length,
      error: devices.filter(d => d.status === DeviceStatus.ERROR).length,
      total: devices.length
    };
  };

  const statusCounts = getStatusCounts();

  const activities = [
    { type: 'success', message: 'Temperature Sensor 001 came online', time: '2 minutes ago' },
    { type: 'warning', message: 'High temperature detected in Main Hall', time: '15 minutes ago' },
    { type: 'error', message: 'Main Gateway connection failed', time: '1 hour ago' },
    { type: 'info', message: 'New device registered: Humidity Sensor 003', time: '2 hours ago' },
  ];

  return (
    <div className="dashboard-container">
      {/* Overlay for mobile */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}
      
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img 
              src="/logo-orus.png" 
              alt="ORUS Logo" 
              className="sidebar-logo-image"
            />
            <div className="sidebar-logo-divider"></div>
            <span className="sidebar-logo-text">ORUS</span>
          </div>
          <button className="sidebar-toggle" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-section-title">Main</div>
            <div 
              className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveSection('dashboard')}
            >
              <svg className="nav-item-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" rx="1"/>
                <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" rx="1"/>
                <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" rx="1"/>
                <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" rx="1"/>
              </svg>
              <span className="nav-item-text">Dashboard</span>
            </div>
            <div 
              className={`nav-item ${activeSection === 'devices' ? 'active' : ''}`}
              onClick={() => setActiveSection('devices')}
            >
              <svg className="nav-item-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="2" width="16" height="20" stroke="currentColor" strokeWidth="2" rx="2"/>
                <circle cx="12" cy="18" r="1" fill="currentColor"/>
              </svg>
              <span className="nav-item-text">Devices</span>
            </div>
            <div 
              className={`nav-item ${activeSection === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveSection('analytics')}
            >
              <svg className="nav-item-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3v18h18M7 16l4-4 4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="nav-item-text">Analytics</span>
            </div>
          </div>

          <div className="nav-section">
            <div className="nav-section-title">Management</div>
            <div 
              className={`nav-item ${activeSection === 'alerts' ? 'active' : ''}`}
              onClick={() => setActiveSection('alerts')}
            >
              <svg className="nav-item-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="nav-item-text">Alerts</span>
            </div>
            <div 
              className={`nav-item ${activeSection === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveSection('settings')}
            >
              <svg className="nav-item-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span className="nav-item-text">Settings</span>
            </div>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">U</div>
            <div className="user-details">
              <p className="user-name">Usuario</p>
              <p className="user-role">Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Top Bar */}
        <header className="top-bar">
          <button className="mobile-menu-button" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>

          <div className="breadcrumb">
            <span className="breadcrumb-item">Home</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item breadcrumb-current">
              {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
            </span>
          </div>

          <div className="top-bar-actions">
            <div className="search-box">
              <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input 
                type="text" 
                className="search-input" 
                placeholder="Search devices..."
              />
            </div>

            <button className="icon-button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="notification-badge"></span>
            </button>

            <button className="logout-button" onClick={onLogout}>
              Logout
            </button>
          </div>
        </header>

        {/* Content Area - Conditional Rendering Based on Active Section */}
        {activeSection === 'dashboard' && (
          <>
        {/* Dashboard Content */}
        <div className="dashboard-content">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Dashboard Overview</h1>
            <p className="dashboard-subtitle">Monitor and manage your IoT ecosystem</p>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon blue">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="4" y="2" width="16" height="20" stroke="currentColor" strokeWidth="2" rx="2"/>
                  </svg>
                </div>
                <span className="stat-trend up">↑ 12%</span>
              </div>
              <div className="stat-label">Total Devices</div>
              <div className="stat-value">{statusCounts.total}</div>
              <div className="stat-description">Active in the network</div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon green">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="stat-trend up">↑ 8%</span>
              </div>
              <div className="stat-label">Online</div>
              <div className="stat-value">{statusCounts.online}</div>
              <div className="stat-description">Devices connected</div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon yellow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <span className="stat-trend down">↓ 3%</span>
              </div>
              <div className="stat-label">Offline</div>
              <div className="stat-value">{statusCounts.offline}</div>
              <div className="stat-description">Devices disconnected</div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon red">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <span className="stat-trend down">↓ 5%</span>
              </div>
              <div className="stat-label">Errors</div>
              <div className="stat-value">{statusCounts.error}</div>
              <div className="stat-description">Devices with issues</div>
            </div>
          </div>

          {/* Widgets Grid */}
          <div className="widgets-grid">
            {/* Metric Cards Row */}
            <div className="widget span-4">
              <div className="metric-card green">
                <div className="metric-content">
                  <div className="metric-value-large">24°C</div>
                  <div className="metric-label-large">Average Temperature</div>
                </div>
                <div className="metric-icon-large">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="widget span-4">
              <div className="metric-card blue">
                <div className="metric-content">
                  <div className="metric-value-large">65%</div>
                  <div className="metric-label-large">Humidity Level</div>
                </div>
                <div className="metric-icon-large">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="widget span-4">
              <div className="metric-card orange">
                <div className="metric-content">
                  <div className="metric-value-large">1.2kW</div>
                  <div className="metric-label-large">Power Consumption</div>
                </div>
                <div className="metric-icon-large">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" fill="currentColor"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="widget span-4">
              <div className="metric-card red">
                <div className="metric-content">
                  <div className="metric-value-large">3</div>
                  <div className="metric-label-large">Active Alerts</div>
                </div>
                <div className="metric-icon-large">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Gauge Widget */}
            <div className="widget span-5">
              <div className="widget-header">
                <h2 className="widget-title">CPU Usage</h2>
              </div>
              <div className="gauge-widget">
                <div className="gauge-container">
                  <div className="gauge-bg">
                    <div className="gauge-fill" style={{ transform: 'rotate(108deg)' }}></div>
                  </div>
                  <div className="gauge-value">72%</div>
                </div>
                <div className="gauge-label">System Load Average</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="widget span-6">
              <div className="widget-header">
                <h2 className="widget-title">Quick Actions</h2>
              </div>
              <div className="quick-actions">
                <div className="action-button">
                  <div className="action-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <span className="action-label">Add Device</span>
                </div>
                <div className="action-button">
                  <div className="action-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="action-label">Export Data</span>
                </div>
                <div className="action-button">
                  <div className="action-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <span className="action-label">Settings</span>
                </div>
                <div className="action-button">
                  <div className="action-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="action-label">Reports</span>
                </div>
              </div>
            </div>

            {/* Progress Bars */}
            <div className="widget span-5">
              <div className="widget-header">
                <h2 className="widget-title">Resource Usage</h2>
              </div>
              <div style={{ padding: '10px 0' }}>
                <div className="progress-item">
                  <div className="progress-header">
                    <span className="progress-label">Memory</span>
                    <span className="progress-value">4.2 GB / 8 GB</span>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar-fill green" style={{ width: '52%' }}></div>
                  </div>
                </div>
                <div className="progress-item">
                  <div className="progress-header">
                    <span className="progress-label">Storage</span>
                    <span className="progress-value">28 GB / 50 GB</span>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar-fill yellow" style={{ width: '56%' }}></div>
                  </div>
                </div>
                <div className="progress-item">
                  <div className="progress-header">
                    <span className="progress-label">Bandwidth</span>
                    <span className="progress-value">82 Mbps / 100 Mbps</span>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar-fill red" style={{ width: '82%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Grafana Chart - Temperature Trends */}
            <div className="widget span-8">
              <div className="widget-header">
                <h2 className="widget-title">Temperature Trends (24h)</h2>
                <div className="widget-actions">
                  <button className="widget-action-button">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </button>
                </div>
              </div>
              {import.meta.env.VITE_GRAFANA_URL ? (
                <div style={{ padding: '20px' }}>
                  <GrafanaPanel
                    dashboardUid={import.meta.env.VITE_GRAFANA_DASHBOARD_TEMP || 'temp-dashboard'}
                    panelId={1}
                    height="280px"
                    timeRange="now-24h"
                    theme="light"
                    refresh="10s"
                  />
                </div>
              ) : (
                <div style={{ 
                  padding: '20px',
                  height: '280px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
                  margin: '20px',
                  borderRadius: '12px',
                  border: '2px dashed #e2e8f0'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto 12px', color: '#cbd5e1' }}>
                      <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M18 9l-5 5-4-4-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <p style={{ margin: '0 0 6px 0', fontSize: '0.9rem', color: '#64748b', fontWeight: '600' }}>
                      Grafana Temperature Chart
                    </p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>
                      Configure VITE_GRAFANA_URL in .env
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Grafana Chart - System Metrics */}
            <div className="widget span-8">
              <div className="widget-header">
                <h2 className="widget-title">System Performance</h2>
                <div className="widget-actions">
                  <button className="widget-action-button">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="1" fill="currentColor"/>
                      <circle cx="19" cy="12" r="1" fill="currentColor"/>
                      <circle cx="5" cy="12" r="1" fill="currentColor"/>
                    </svg>
                  </button>
                </div>
              </div>
              {import.meta.env.VITE_GRAFANA_URL ? (
                <div style={{ padding: '20px' }}>
                  <GrafanaPanel
                    dashboardUid={import.meta.env.VITE_GRAFANA_DASHBOARD_ANALYTICS || 'analytics-dashboard'}
                    panelId={3}
                    height="280px"
                    timeRange="now-6h"
                    theme="light"
                    refresh="30s"
                  />
                </div>
              ) : (
                <div style={{ 
                  padding: '20px',
                  height: '280px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
                  margin: '20px',
                  borderRadius: '12px',
                  border: '2px dashed #e2e8f0'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto 12px', color: '#cbd5e1' }}>
                      <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" rx="1"/>
                      <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" rx="1"/>
                      <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" rx="1"/>
                      <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" rx="1"/>
                    </svg>
                    <p style={{ margin: '0 0 6px 0', fontSize: '0.9rem', color: '#64748b', fontWeight: '600' }}>
                      Grafana System Metrics
                    </p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>
                      Configure VITE_GRAFANA_URL in .env
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Device Table */}
            <div className="widget span-16">
              <div className="widget-header">
                <h2 className="widget-title">Device Overview</h2>
                <div className="widget-actions">
                  <button className="widget-action-button">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button className="widget-action-button">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="1" fill="currentColor"/>
                      <circle cx="19" cy="12" r="1" fill="currentColor"/>
                      <circle cx="5" cy="12" r="1" fill="currentColor"/>
                    </svg>
                  </button>
                </div>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Device Name</th>
                    <th>Type</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Last Update</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {devices.map(device => (
                    <tr key={device.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div className={`device-status-indicator ${device.status.toLowerCase()}`}></div>
                          <strong>{device.name}</strong>
                        </div>
                      </td>
                      <td>{device.type}</td>
                      <td>{device.location}</td>
                      <td>
                        <span className={`status-badge ${
                          device.status === DeviceStatus.ONLINE ? 'success' : 
                          device.status === DeviceStatus.ERROR ? 'error' : 'warning'
                        }`}>
                          {device.status}
                        </span>
                      </td>
                      <td>{device.lastUpdate.toLocaleTimeString()}</td>
                      <td>
                        {device.data?.temperature && `${device.data.temperature}°C`}
                        {device.data?.humidity && !device.data?.temperature && `${device.data.humidity}%`}
                        {device.data?.state && device.data.state}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Activity Feed */}
            <div className="widget span-8">
              <div className="widget-header">
                <h2 className="widget-title">Recent Activity</h2>
                <div className="widget-actions">
                  <button className="widget-action-button">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M23 4v6h-6M1 20v-6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="activity-feed">
                {activities.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div className={`activity-icon ${activity.type}`}>
                      {activity.type === 'success' && '✓'}
                      {activity.type === 'warning' && '!'}
                      {activity.type === 'error' && '×'}
                      {activity.type === 'info' && 'i'}
                    </div>
                    <div className="activity-content">
                      <p className="activity-message">{activity.message}</p>
                      <p className="activity-time">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Status Widget */}
            <div className="widget span-8">
              <div className="widget-header">
                <h2 className="widget-title">System Status</h2>
                <div className="widget-actions">
                  <button className="widget-action-button">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="1" fill="currentColor"/>
                      <circle cx="19" cy="12" r="1" fill="currentColor"/>
                      <circle cx="5" cy="12" r="1" fill="currentColor"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="device-list">
                <div className="device-item">
                  <div className="device-status-indicator online"></div>
                  <div className="device-info">
                    <h3 className="device-name">API Server</h3>
                    <p className="device-location">Operational</p>
                  </div>
                  <div className="device-value">99.9<span className="device-unit">%</span></div>
                </div>
                <div className="device-item">
                  <div className="device-status-indicator online"></div>
                  <div className="device-info">
                    <h3 className="device-name">Database</h3>
                    <p className="device-location">Operational</p>
                  </div>
                  <div className="device-value">98.7<span className="device-unit">%</span></div>
                </div>
                <div className="device-item">
                  <div className="device-status-indicator online"></div>
                  <div className="device-info">
                    <h3 className="device-name">MQTT Broker</h3>
                    <p className="device-location">Operational</p>
                  </div>
                  <div className="device-value">100<span className="device-unit">%</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
          </>
        )}

        {/* Other Pages */}
        {activeSection === 'devices' && <DevicesPage />}
        {activeSection === 'analytics' && <AnalyticsPage />}
        {activeSection === 'alerts' && <AlertsPage />}
        {activeSection === 'settings' && <SettingsPage />}
      </main>
    </div>
  );
};

export default Dashboard;