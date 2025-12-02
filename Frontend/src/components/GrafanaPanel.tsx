import React from 'react';

interface GrafanaPanelProps {
  dashboardUid: string;
  panelId: number;
  height?: string;
  timeRange?: string;
  theme?: 'light' | 'dark';
  refresh?: string;
  orgId?: number;
}

const GrafanaPanel: React.FC<GrafanaPanelProps> = ({
  dashboardUid,
  panelId,
  height = '300px',
  timeRange = 'now-6h',
  theme = 'light',
  refresh = '30s',
  orgId = 1
}) => {
  const grafanaUrl = import.meta.env.VITE_GRAFANA_URL || 'http://localhost:3000';
  
  // Construir URL del panel embebido
  const panelUrl = `${grafanaUrl}/d-solo/${dashboardUid}?orgId=${orgId}&theme=${theme}&panelId=${panelId}&from=${timeRange}&to=now&refresh=${refresh}`;

  return (
    <div style={{ 
      width: '100%', 
      height: height,
      borderRadius: '12px',
      overflow: 'hidden',
      background: '#f8fafc'
    }}>
      <iframe
        src={panelUrl}
        width="100%"
        height="100%"
        frameBorder="0"
        style={{ 
          border: 'none',
          borderRadius: '12px'
        }}
        title={`Grafana Panel ${panelId}`}
      />
    </div>
  );
};

export default GrafanaPanel;
