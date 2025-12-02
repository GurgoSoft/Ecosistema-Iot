import React, { useState } from 'react';
import { Device, DeviceType, DeviceStatus } from '../types';
import './Pages.css';

const DevicesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  // Datos de ejemplo expandidos
  const allDevices: Device[] = [
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
    },
    {
      id: '5',
      name: 'Door Lock 001',
      type: DeviceType.ACTUATOR,
      status: DeviceStatus.ONLINE,
      location: 'Main Entrance',
      lastUpdate: new Date(Date.now() - 60000),
      data: { state: 'locked' }
    },
    {
      id: '6',
      name: 'Motion Sensor 002',
      type: DeviceType.SENSOR,
      status: DeviceStatus.OFFLINE,
      location: 'Parking Lot',
      lastUpdate: new Date(Date.now() - 3600000),
      data: { motion: false }
    },
    {
      id: '7',
      name: 'Temperature Sensor 004',
      type: DeviceType.SENSOR,
      status: DeviceStatus.ONLINE,
      location: 'Server Room',
      lastUpdate: new Date(Date.now() - 30000),
      data: { temperature: 18.5 }
    },
    {
      id: '8',
      name: 'Backup Gateway',
      type: DeviceType.GATEWAY,
      status: DeviceStatus.ONLINE,
      location: 'Data Center',
      lastUpdate: new Date(Date.now() - 90000),
    }
  ];

  const filteredDevices = allDevices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || device.status.toLowerCase() === filterStatus;
    const matchesType = filterType === 'all' || device.type.toLowerCase() === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div style={{ padding: '32px 48px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1e293b', margin: '0 0 8px 0' }}>
          Devices
        </h1>
        <p style={{ fontSize: '0.95rem', color: '#64748b', margin: 0 }}>
          Manage and monitor all your IoT devices
        </p>
      </div>

      {/* Filters and Actions */}
      <div style={{ 
        background: 'white', 
        borderRadius: '16px', 
        padding: '24px', 
        marginBottom: '28px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '16px', flex: 1, flexWrap: 'wrap' }}>
            {/* Search */}
            <div style={{ position: 'relative', minWidth: '300px', flex: 1, maxWidth: '400px' }}>
              <input
                type="text"
                placeholder="Search devices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 40px',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
              <svg 
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                fontSize: '0.95rem',
                outline: 'none',
                cursor: 'pointer',
                background: 'white'
              }}
            >
              <option value="all">All Status</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="error">Error</option>
            </select>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                fontSize: '0.95rem',
                outline: 'none',
                cursor: 'pointer',
                background: 'white'
              }}
            >
              <option value="all">All Types</option>
              <option value="sensor">Sensor</option>
              <option value="actuator">Actuator</option>
              <option value="gateway">Gateway</option>
            </select>
          </div>

          {/* Add Device Button */}
          <button style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '0.95rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Add Device
          </button>
        </div>
      </div>

      {/* Devices Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
        gap: '24px' 
      }}>
        {filteredDevices.map(device => (
          <div 
            key={device.id}
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
            }}
          >
            {/* Device Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className={`device-status-indicator ${device.status.toLowerCase()}`}></div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600', color: '#1e293b' }}>
                    {device.name}
                  </h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                    {device.location}
                  </p>
                </div>
              </div>
              <span className={`status-badge ${
                device.status === DeviceStatus.ONLINE ? 'success' : 
                device.status === DeviceStatus.ERROR ? 'error' : 'warning'
              }`}>
                {device.status}
              </span>
            </div>

            {/* Device Info */}
            <div style={{ marginBottom: '16px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Type
                  </p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.95rem', fontWeight: '500', color: '#1e293b' }}>
                    {device.type}
                  </p>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Last Update
                  </p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.95rem', fontWeight: '500', color: '#1e293b' }}>
                    {device.lastUpdate.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Device Data */}
            {device.data && (
              <div style={{ 
                background: '#f8fafc', 
                borderRadius: '10px', 
                padding: '12px', 
                marginBottom: '16px' 
              }}>
                {Object.entries(device.data).map(([key, value]) => (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.85rem', color: '#64748b', textTransform: 'capitalize' }}>
                      {key}:
                    </span>
                    <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#1e293b' }}>
                      {typeof value === 'number' ? value.toFixed(1) : value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{
                flex: 1,
                padding: '10px',
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: '500',
                color: '#475569',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}>
                View Details
              </button>
              <button style={{
                padding: '10px 12px',
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="1" fill="#475569"/>
                  <circle cx="19" cy="12" r="1" fill="#475569"/>
                  <circle cx="5" cy="12" r="1" fill="#475569"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredDevices.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '80px 20px',
          background: 'white',
          borderRadius: '16px',
          border: '2px dashed #e2e8f0'
        }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto 16px', color: '#cbd5e1' }}>
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
            <path d="M9 9h6M9 15h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#64748b', margin: '0 0 8px 0' }}>
            No devices found
          </h3>
          <p style={{ fontSize: '0.95rem', color: '#94a3b8', margin: 0 }}>
            Try adjusting your filters or add a new device
          </p>
        </div>
      )}
    </div>
  );
};

export default DevicesPage;
