import React, { useState } from 'react';
import './Pages.css';
import GrafanaPanel from '../components/GrafanaPanel';

const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');

  return (
    <div style={{ padding: '32px 48px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1e293b', margin: '0 0 8px 0' }}>
            Analytics
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#64748b', margin: 0 }}>
            Monitor and analyze your IoT data
          </p>
        </div>
        
        {/* Time Range Selector */}
        <div style={{ display: 'flex', gap: '8px', background: 'white', padding: '6px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          {['24h', '7d', '30d', '90d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              style={{
                padding: '8px 16px',
                background: timeRange === range ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : 'transparent',
                color: timeRange === range ? 'white' : '#64748b',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {[
          { title: 'Total Events', value: '2,847', change: '+12.5%', trend: 'up', color: '#3b82f6' },
          { title: 'Avg Temperature', value: '22.3°C', change: '+1.2°C', trend: 'up', color: '#10b981' },
          { title: 'Energy Usage', value: '145.8 kWh', change: '-8.3%', trend: 'down', color: '#f59e0b' },
          { title: 'Uptime', value: '99.2%', change: '+0.5%', trend: 'up', color: '#8b5cf6' },
        ].map((stat, index) => (
          <div 
            key={index}
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '28px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: `${stat.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: stat.color
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18 9l-5 5-4-4-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>{stat.title}</p>
                <h3 style={{ margin: '4px 0 0 0', fontSize: '1.75rem', fontWeight: '700', color: '#1e293b' }}>{stat.value}</h3>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ 
                color: stat.trend === 'up' ? '#10b981' : '#f59e0b',
                fontSize: '0.85rem',
                fontWeight: '600'
              }}>
                {stat.trend === 'up' ? '↑' : '↓'} {stat.change}
              </span>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>vs last period</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(16, 1fr)', gap: '28px' }}>
        {/* Main Chart */}
        <div className="widget span-12" style={{ gridColumn: 'span 12' }}>
          <div style={{ 
            background: 'white', 
            borderRadius: '16px', 
            padding: '28px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}>
                  Temperature Trends
                </h2>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                  Hourly average temperature readings
                </p>
              </div>
              <select style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                fontSize: '0.85rem',
                outline: 'none',
                cursor: 'pointer'
              }}>
                <option>Temperature</option>
                <option>Humidity</option>
                <option>Pressure</option>
              </select>
            </div>
            
            {/* Grafana Chart - Temperature Trends */}
            {import.meta.env.VITE_GRAFANA_URL ? (
              <GrafanaPanel
                dashboardUid={import.meta.env.VITE_GRAFANA_DASHBOARD_TEMP || 'temperature-dashboard'}
                panelId={2}
                height="300px"
                timeRange={timeRange === '24h' ? 'now-24h' : timeRange === '7d' ? 'now-7d' : timeRange === '30d' ? 'now-30d' : 'now-90d'}
                theme="light"
                refresh="30s"
              />
            ) : (
              <div style={{ 
                height: '300px', 
                background: 'linear-gradient(180deg, #f1f5f9 0%, #ffffff 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px dashed #e2e8f0'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto 12px', color: '#cbd5e1' }}>
                    <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18 9l-5 5-4-4-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <p style={{ margin: '0 0 8px 0', fontSize: '0.95rem', color: '#94a3b8', fontWeight: '500' }}>
                    Grafana Chart - Temperature Trends
                  </p>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1' }}>
                    Configure VITE_GRAFANA_URL en .env para activar
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Device Distribution */}
        <div className="widget span-4" style={{ gridColumn: 'span 4' }}>
          <div style={{ 
            background: 'white', 
            borderRadius: '16px', 
            padding: '28px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            height: '100%'
          }}>
            <h2 style={{ margin: '0 0 24px 0', fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}>
              Device Types
            </h2>
            
            {/* Donut Chart Placeholder */}
            <div style={{ 
              height: '200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px'
            }}>
              <div style={{
                width: '160px',
                height: '160px',
                borderRadius: '50%',
                background: 'conic-gradient(#3b82f6 0deg 144deg, #10b981 144deg 252deg, #f59e0b 252deg 360deg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  background: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column'
                }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>8</span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Total</span>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Sensors', count: 4, color: '#3b82f6', percentage: 50 },
                { label: 'Actuators', count: 2, color: '#10b981', percentage: 25 },
                { label: 'Gateways', count: 2, color: '#f59e0b', percentage: 25 },
              ].map((item, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ 
                      width: '12px', 
                      height: '12px', 
                      borderRadius: '3px', 
                      background: item.color 
                    }}></div>
                    <span style={{ fontSize: '0.9rem', color: '#64748b' }}>{item.label}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#1e293b' }}>{item.count}</span>
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>({item.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Event Timeline */}
        <div className="widget span-16" style={{ gridColumn: 'span 16' }}>
          <div style={{ 
            background: 'white', 
            borderRadius: '16px', 
            padding: '28px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
          }}>
            <h2 style={{ margin: '0 0 24px 0', fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}>
              Recent Events
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { time: '10:23 AM', event: 'Temperature spike detected', sensor: 'Sensor 001', value: '+5.2°C', type: 'warning' },
                { time: '10:15 AM', event: 'New device connected', sensor: 'Gateway 002', value: 'Online', type: 'success' },
                { time: '10:05 AM', event: 'Motion detected', sensor: 'Sensor 002', value: 'Active', type: 'info' },
                { time: '09:48 AM', event: 'Low battery alert', sensor: 'Sensor 003', value: '15%', type: 'error' },
                { time: '09:30 AM', event: 'Humidity normal', sensor: 'Sensor 004', value: '45%', type: 'success' },
              ].map((event, index) => (
                <div 
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '16px',
                    background: '#f8fafc',
                    borderRadius: '12px',
                    gap: '16px'
                  }}
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: event.type === 'warning' ? '#fef3c7' :
                               event.type === 'error' ? '#fee2e2' :
                               event.type === 'success' ? '#d1fae5' : '#dbeafe',
                    color: event.type === 'warning' ? '#f59e0b' :
                          event.type === 'error' ? '#ef4444' :
                          event.type === 'success' ? '#10b981' : '#3b82f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {event.type === 'warning' && '!'}
                    {event.type === 'error' && '×'}
                    {event.type === 'success' && '✓'}
                    {event.type === 'info' && 'i'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', fontWeight: '600', color: '#1e293b' }}>
                      {event.event}
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                      {event.sensor}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}>
                      {event.value}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      {event.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
