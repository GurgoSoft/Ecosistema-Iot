import React, { useState } from 'react';
import './Pages.css';

const AlertsPage: React.FC = () => {
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const alerts = [
    {
      id: 1,
      title: 'High Temperature Alert',
      description: 'Temperature exceeded threshold in Main Hall',
      sensor: 'Temperature Sensor 001',
      priority: 'high',
      status: 'active',
      time: '5 minutes ago',
      value: '32.5°C',
      threshold: '30°C'
    },
    {
      id: 2,
      title: 'Device Offline',
      description: 'Motion Sensor lost connection',
      sensor: 'Motion Sensor 002',
      priority: 'medium',
      status: 'active',
      time: '15 minutes ago',
      value: 'Offline',
      threshold: 'Online'
    },
    {
      id: 3,
      title: 'Low Battery',
      description: 'Battery level critical',
      sensor: 'Humidity Sensor 003',
      priority: 'medium',
      status: 'active',
      time: '1 hour ago',
      value: '12%',
      threshold: '20%'
    },
    {
      id: 4,
      title: 'Gateway Connection Failed',
      description: 'Main Gateway unable to connect',
      sensor: 'Main Gateway',
      priority: 'high',
      status: 'resolved',
      time: '2 hours ago',
      value: 'Error',
      threshold: 'Connected'
    },
    {
      id: 5,
      title: 'Humidity Warning',
      description: 'Humidity levels above normal range',
      sensor: 'Humidity Sensor 003',
      priority: 'low',
      status: 'acknowledged',
      time: '3 hours ago',
      value: '75%',
      threshold: '70%'
    },
  ];

  const filteredAlerts = alerts.filter(alert => {
    const matchesPriority = filterPriority === 'all' || alert.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || alert.status === filterStatus;
    return matchesPriority && matchesStatus;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return { bg: '#fee2e2', color: '#ef4444', border: '#fecaca' };
      case 'medium': return { bg: '#fef3c7', color: '#f59e0b', border: '#fde68a' };
      case 'low': return { bg: '#dbeafe', color: '#3b82f6', border: '#bfdbfe' };
      default: return { bg: '#f1f5f9', color: '#64748b', border: '#e2e8f0' };
    }
  };

  const stats = {
    total: alerts.length,
    active: alerts.filter(a => a.status === 'active').length,
    acknowledged: alerts.filter(a => a.status === 'acknowledged').length,
    resolved: alerts.filter(a => a.status === 'resolved').length,
  };

  return (
    <div style={{ padding: '32px 48px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1e293b', margin: '0 0 8px 0' }}>
          Alerts
        </h1>
        <p style={{ fontSize: '0.95rem', color: '#64748b', margin: 0 }}>
          Monitor and manage system alerts and notifications
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {[
          { label: 'Total Alerts', value: stats.total, color: '#64748b', icon: '📋' },
          { label: 'Active', value: stats.active, color: '#ef4444', icon: '🔴' },
          { label: 'Acknowledged', value: stats.acknowledged, color: '#f59e0b', icon: '👁️' },
          { label: 'Resolved', value: stats.resolved, color: '#10b981', icon: '✅' },
        ].map((stat, index) => (
          <div 
            key={index}
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <span style={{ fontSize: '1.5rem' }}>{stat.icon}</span>
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>{stat.label}</span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: stat.color }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ 
        background: 'white', 
        borderRadius: '16px', 
        padding: '24px', 
        marginBottom: '28px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        gap: '16px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#64748b' }}>Filter by:</span>
        
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          style={{
            padding: '10px 16px',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            fontSize: '0.9rem',
            outline: 'none',
            cursor: 'pointer',
            background: 'white'
          }}
        >
          <option value="all">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            padding: '10px 16px',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            fontSize: '0.9rem',
            outline: 'none',
            cursor: 'pointer',
            background: 'white'
          }}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="acknowledged">Acknowledged</option>
          <option value="resolved">Resolved</option>
        </select>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
          <button style={{
            padding: '10px 20px',
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '10px',
            fontSize: '0.9rem',
            fontWeight: '600',
            color: '#475569',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}>
            Mark All as Read
          </button>
          <button style={{
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}>
            Clear Resolved
          </button>
        </div>
      </div>

      {/* Alerts List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredAlerts.map((alert) => {
          const priorityStyle = getPriorityColor(alert.priority);
          
          return (
            <div 
              key={alert.id}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                border: `1px solid ${priorityStyle.border}`,
                borderLeft: `4px solid ${priorityStyle.color}`,
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.2s',
                opacity: alert.status === 'resolved' ? 0.6 : 1
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                {/* Priority Icon */}
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: priorityStyle.bg,
                  color: priorityStyle.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  flexShrink: 0
                }}>
                  {alert.priority === 'high' && '🔴'}
                  {alert.priority === 'medium' && '🟡'}
                  {alert.priority === 'low' && '🔵'}
                </div>

                {/* Alert Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div>
                      <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', fontWeight: '600', color: '#1e293b' }}>
                        {alert.title}
                      </h3>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>
                        {alert.description}
                      </p>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0, marginLeft: '16px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        background: priorityStyle.bg,
                        color: priorityStyle.color,
                        border: `1px solid ${priorityStyle.border}`
                      }}>
                        {alert.priority}
                      </span>
                      <span className={`status-badge ${
                        alert.status === 'active' ? 'error' : 
                        alert.status === 'acknowledged' ? 'warning' : 'success'
                      }`}>
                        {alert.status}
                      </span>
                    </div>
                  </div>

                  {/* Alert Details */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                    gap: '16px',
                    marginTop: '16px',
                    padding: '16px',
                    background: '#f8fafc',
                    borderRadius: '12px'
                  }}>
                    <div>
                      <p style={{ margin: '0 0 4px 0', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>
                        Device
                      </p>
                      <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '600', color: '#1e293b' }}>
                        {alert.sensor}
                      </p>
                    </div>
                    <div>
                      <p style={{ margin: '0 0 4px 0', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>
                        Current Value
                      </p>
                      <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '600', color: priorityStyle.color }}>
                        {alert.value}
                      </p>
                    </div>
                    <div>
                      <p style={{ margin: '0 0 4px 0', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>
                        Threshold
                      </p>
                      <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '600', color: '#1e293b' }}>
                        {alert.threshold}
                      </p>
                    </div>
                    <div>
                      <p style={{ margin: '0 0 4px 0', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>
                        Time
                      </p>
                      <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '600', color: '#1e293b' }}>
                        {alert.time}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                    {alert.status === 'active' && (
                      <>
                        <button style={{
                          padding: '8px 16px',
                          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}>
                          Acknowledge
                        </button>
                        <button style={{
                          padding: '8px 16px',
                          background: '#f1f5f9',
                          color: '#475569',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}>
                          View Device
                        </button>
                      </>
                    )}
                    {alert.status === 'acknowledged' && (
                      <button style={{
                        padding: '8px 16px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}>
                        Mark as Resolved
                      </button>
                    )}
                    <button style={{
                      padding: '8px 16px',
                      background: 'transparent',
                      color: '#64748b',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}>
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredAlerts.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '80px 20px',
          background: 'white',
          borderRadius: '16px',
          border: '2px dashed #e2e8f0'
        }}>
          <span style={{ fontSize: '4rem' }}>✅</span>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#64748b', margin: '16px 0 8px 0' }}>
            No alerts found
          </h3>
          <p style={{ fontSize: '0.95rem', color: '#94a3b8', margin: 0 }}>
            All systems operating normally
          </p>
        </div>
      )}
    </div>
  );
};

export default AlertsPage;
