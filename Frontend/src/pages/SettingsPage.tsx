import React, { useState } from 'react';
import './Pages.css';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div style={{ padding: '32px 48px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1e293b', margin: '0 0 8px 0' }}>
          Settings
        </h1>
        <p style={{ fontSize: '0.95rem', color: '#64748b', margin: 0 }}>
          Configure your IoT platform settings
        </p>
      </div>

      {/* Tabs */}
      <div style={{ 
        background: 'white', 
        borderRadius: '16px', 
        padding: '8px',
        marginBottom: '28px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        display: 'inline-flex',
        gap: '8px'
      }}>
        {['general', 'notifications', 'security', 'integrations'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '12px 24px',
              background: activeTab === tab ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : 'transparent',
              color: activeTab === tab ? 'white' : '#64748b',
              border: 'none',
              borderRadius: '10px',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              textTransform: 'capitalize',
              transition: 'all 0.2s'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '28px' }}>
        {activeTab === 'general' && (
          <>
            {/* Profile Settings */}
            <div style={{ 
              background: 'white', 
              borderRadius: '16px', 
              padding: '28px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
            }}>
              <h2 style={{ margin: '0 0 20px 0', fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}>
                Profile Settings
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500', color: '#475569' }}>
                    Organization Name
                  </label>
                  <input
                    type="text"
                    defaultValue="ORUS IoT"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      fontSize: '0.95rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500', color: '#475569' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue="admin@orus.com"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      fontSize: '0.95rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500', color: '#475569' }}>
                    Timezone
                  </label>
                  <select style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.95rem',
                    outline: 'none',
                    cursor: 'pointer',
                    boxSizing: 'border-box'
                  }}>
                    <option>UTC-05:00 (Eastern Time)</option>
                    <option>UTC-06:00 (Central Time)</option>
                    <option>UTC-07:00 (Mountain Time)</option>
                    <option>UTC-08:00 (Pacific Time)</option>
                  </select>
                </div>

                <button style={{
                  padding: '12px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginTop: '8px'
                }}>
                  Save Changes
                </button>
              </div>
            </div>

            {/* System Preferences */}
            <div style={{ 
              background: 'white', 
              borderRadius: '16px', 
              padding: '28px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
            }}>
              <h2 style={{ margin: '0 0 20px 0', fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}>
                System Preferences
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {[
                  { label: 'Dark Mode', description: 'Enable dark theme', checked: false },
                  { label: 'Auto-refresh', description: 'Automatically refresh dashboard data', checked: true },
                  { label: 'Sound Alerts', description: 'Play sound for critical alerts', checked: true },
                  { label: 'Email Notifications', description: 'Receive email notifications', checked: false },
                ].map((setting, index) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '16px',
                    background: '#f8fafc',
                    borderRadius: '12px'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}>
                        {setting.label}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                        {setting.description}
                      </div>
                    </div>
                    <label style={{ position: 'relative', display: 'inline-block', width: '52px', height: '28px' }}>
                      <input 
                        type="checkbox" 
                        defaultChecked={setting.checked}
                        style={{ opacity: 0, width: 0, height: 0 }}
                      />
                      <span style={{
                        position: 'absolute',
                        cursor: 'pointer',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: setting.checked ? '#3b82f6' : '#cbd5e1',
                        borderRadius: '28px',
                        transition: '0.4s'
                      }}>
                        <span style={{
                          position: 'absolute',
                          content: '""',
                          height: '20px',
                          width: '20px',
                          left: setting.checked ? '28px' : '4px',
                          bottom: '4px',
                          background: 'white',
                          borderRadius: '50%',
                          transition: '0.4s'
                        }}></span>
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'notifications' && (
          <div style={{ 
            gridColumn: '1 / -1',
            background: 'white', 
            borderRadius: '16px', 
            padding: '28px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
          }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}>
              Notification Preferences
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              {[
                { type: 'Device Alerts', email: true, push: true, sms: false },
                { type: 'System Updates', email: true, push: false, sms: false },
                { type: 'Critical Errors', email: true, push: true, sms: true },
                { type: 'Weekly Reports', email: true, push: false, sms: false },
              ].map((notif, index) => (
                <div key={index} style={{ 
                  padding: '20px',
                  background: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem', fontWeight: '600', color: '#1e293b' }}>
                    {notif.type}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { label: '📧 Email', checked: notif.email },
                      { label: '🔔 Push', checked: notif.push },
                      { label: '📱 SMS', checked: notif.sms },
                    ].map((channel, i) => (
                      <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          defaultChecked={channel.checked}
                          style={{
                            width: '18px',
                            height: '18px',
                            cursor: 'pointer'
                          }}
                        />
                        <span style={{ fontSize: '0.9rem', color: '#475569' }}>{channel.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <>
            <div style={{ 
              background: 'white', 
              borderRadius: '16px', 
              padding: '28px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
            }}>
              <h2 style={{ margin: '0 0 20px 0', fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}>
                Change Password
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500', color: '#475569' }}>
                    Current Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      fontSize: '0.95rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500', color: '#475569' }}>
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      fontSize: '0.95rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500', color: '#475569' }}>
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      fontSize: '0.95rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <button style={{
                  padding: '12px',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginTop: '8px'
                }}>
                  Update Password
                </button>
              </div>
            </div>

            <div style={{ 
              background: 'white', 
              borderRadius: '16px', 
              padding: '28px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
            }}>
              <h2 style={{ margin: '0 0 20px 0', fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}>
                Two-Factor Authentication
              </h2>
              
              <div style={{ 
                padding: '20px',
                background: '#f0fdf4',
                border: '1px solid #86efac',
                borderRadius: '12px',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '1.5rem' }}>✅</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#166534' }}>
                    Two-factor authentication is enabled
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#15803d', paddingLeft: '36px' }}>
                  Your account is protected with an additional layer of security
                </p>
              </div>

              <button style={{
                width: '100%',
                padding: '12px',
                background: '#f1f5f9',
                color: '#475569',
                border: 'none',
                borderRadius: '10px',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                Disable 2FA
              </button>
            </div>
          </>
        )}

        {activeTab === 'integrations' && (
          <div style={{ 
            gridColumn: '1 / -1',
            background: 'white', 
            borderRadius: '16px', 
            padding: '28px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
          }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}>
              API & Integrations
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              {[
                { name: 'MQTT Broker', status: 'Connected', icon: '🔗', color: '#10b981' },
                { name: 'Webhook Integration', status: 'Active', icon: '🪝', color: '#3b82f6' },
                { name: 'REST API', status: 'Enabled', icon: '⚡', color: '#8b5cf6' },
                { name: 'Cloud Storage', status: 'Disconnected', icon: '☁️', color: '#64748b' },
              ].map((integration, index) => (
                <div key={index} style={{ 
                  padding: '24px',
                  background: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '2rem' }}>{integration.icon}</span>
                    <div>
                      <h3 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: '600', color: '#1e293b' }}>
                        {integration.name}
                      </h3>
                      <span style={{ 
                        fontSize: '0.8rem', 
                        fontWeight: '600',
                        color: integration.color,
                        textTransform: 'uppercase'
                      }}>
                        {integration.status}
                      </span>
                    </div>
                  </div>
                  <button style={{
                    width: '100%',
                    padding: '10px',
                    background: 'white',
                    color: '#475569',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginTop: '12px'
                  }}>
                    Configure
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
