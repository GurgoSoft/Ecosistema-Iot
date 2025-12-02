import React from 'react';
import { Device, DeviceStatus } from '../types';

interface DeviceCardProps {
  device: Device;
  onSelect?: (device: Device) => void;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device, onSelect }) => {
  const getStatusColor = (status: DeviceStatus) => {
    switch (status) {
      case DeviceStatus.ONLINE:
        return '#4CAF50';
      case DeviceStatus.OFFLINE:
        return '#9E9E9E';
      case DeviceStatus.ERROR:
        return '#F44336';
      case DeviceStatus.MAINTENANCE:
        return '#FF9800';
      default:
        return '#9E9E9E';
    }
  };

  return (
    <div 
      className="device-card"
      onClick={() => onSelect?.(device)}
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        margin: '8px',
        cursor: onSelect ? 'pointer' : 'default',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        backgroundColor: '#fff',
        color: '#333'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: '0 0 8px 0', color: '#333' }}>{device.name}</h3>
        <div 
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: getStatusColor(device.status)
          }}
        />
      </div>
      <p style={{ margin: '4px 0', color: '#666' }}>
        <strong>Tipo:</strong> {device.type}
      </p>
      <p style={{ margin: '4px 0', color: '#666' }}>
        <strong>Ubicación:</strong> {device.location}
      </p>
      <p style={{ margin: '4px 0', color: '#666' }}>
        <strong>Estado:</strong> {device.status}
      </p>
      <p style={{ margin: '4px 0', fontSize: '12px', color: '#999' }}>
        Última actualización: {new Date(device.lastUpdate).toLocaleString()}
      </p>
    </div>
  );
};

export default DeviceCard;