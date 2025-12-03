import React, { useState, useEffect } from 'react';
import './FieldSelectionPage.css';
import AddFieldModal from '../components/AddFieldModal';

interface FieldData {
  id: string;
  name: string;
  location: string;
  area: string;
  cropType: string;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  moisture: number;
  temperature: number;
  lastUpdate: string;
  imageUrl?: string;
}

interface FieldSelectionPageProps {
  onFieldSelect?: (fieldId: string) => void;
  onLogout?: () => void;
  showDashboardButton?: boolean;
  onGoToDashboard?: () => void;
}

const FieldSelectionPage: React.FC<FieldSelectionPageProps> = ({ onFieldSelect, onLogout, showDashboardButton = true, onGoToDashboard }) => {
  // Función para cargar campos desde localStorage o datos iniciales
  const loadInitialFields = (): FieldData[] => {
    const savedFields = localStorage.getItem('fields');
    if (savedFields) {
      return JSON.parse(savedFields);
    }
    
    // Datos iniciales por defecto
    return [
      {
        id: '1',
        name: 'Campo Norte',
        location: 'Sector A - Valle Central',
        area: '12.5 ha',
        cropType: 'Maíz',
        status: 'excellent',
        moisture: 78,
        temperature: 24,
        lastUpdate: 'Hace 5 minutos',
        imageUrl: '/field-placeholder.jpg'
      },
      {
        id: '2',
        name: 'Campo Sur',
        location: 'Sector B - Planicie Este',
        area: '8.3 ha',
        cropType: 'Trigo',
        status: 'good',
        moisture: 65,
        temperature: 26,
        lastUpdate: 'Hace 12 minutos',
        imageUrl: '/field-placeholder.jpg'
      },
      {
        id: '3',
        name: 'Invernadero Alpha',
        location: 'Zona Industrial',
        area: '2.1 ha',
        cropType: 'Tomates',
        status: 'warning',
        moisture: 52,
        temperature: 29,
        lastUpdate: 'Hace 18 minutos',
        imageUrl: '/field-placeholder.jpg'
      },
      {
        id: '4',
        name: 'Campo Oeste',
        location: 'Sector C - Ladera',
        area: '15.7 ha',
        cropType: 'Soja',
        status: 'good',
        moisture: 71,
        temperature: 23,
        lastUpdate: 'Hace 8 minutos',
        imageUrl: '/field-placeholder.jpg'
      }
    ];
  };

  const [fields, setFields] = useState<FieldData[]>(loadInitialFields);

  // Guardar campos en localStorage cada vez que cambien
  useEffect(() => {
    localStorage.setItem('fields', JSON.stringify(fields));
  }, [fields]);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddFieldModal, setShowAddFieldModal] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return '#10b981';
      case 'good': return '#3b82f6';
      case 'warning': return '#f59e0b';
      case 'critical': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'excellent': return 'Excelente';
      case 'good': return 'Bueno';
      case 'warning': return 'Atención';
      case 'critical': return 'Crítico';
      default: return 'Desconocido';
    }
  };

  const filteredFields = fields.filter(field =>
    field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    field.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    field.cropType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFieldClick = (fieldId: string) => {
    console.log('Campo seleccionado:', fieldId);
    onFieldSelect?.(fieldId);
  };

  const handleAddNewField = () => {
    console.log('Agregar nuevo campo');
    setShowAddFieldModal(true);
  };

  const handleSaveField = (fieldData: any) => {
    console.log('Nuevo campo guardado:', fieldData);
    
    // Crear nuevo campo con ID único
    const newField: FieldData = {
      id: (fields.length + 1).toString(),
      name: fieldData.name,
      location: fieldData.location,
      area: fieldData.area + ' ha',
      cropType: fieldData.cropType,
      status: 'good',
      moisture: fieldData.soilAnalysis.moisture,
      temperature: 24,
      lastUpdate: 'Recién creado'
    };
    
    // Agregar el nuevo campo al estado
    setFields([...fields, newField]);
  };

  return (
    <div className="field-selection-page">
      {/* Header */}
      <header className="field-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="page-title">Mis Campos</h1>
            <p className="page-subtitle">Selecciona un campo para ver su monitoreo en tiempo real</p>
          </div>
          <div className="header-right">
            {onGoToDashboard && (
              <button className="dashboard-button" onClick={onGoToDashboard}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" rx="1"/>
                  <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" rx="1"/>
                  <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" rx="1"/>
                  <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" rx="1"/>
                </svg>
                Ver Dashboard
              </button>
            )}
            <button className="add-field-button" onClick={handleAddNewField}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Agregar Campo
            </button>
            {onLogout && (
              <button className="logout-button" onClick={onLogout} title="Cerrar sesión">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className="field-toolbar">
        <div className="search-container">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por nombre, ubicación o cultivo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="view-toggle">
          <button
            className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Vista de cuadrícula"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="8" height="8" stroke="currentColor" strokeWidth="2"/>
              <rect x="3" y="13" width="8" height="8" stroke="currentColor" strokeWidth="2"/>
              <rect x="13" y="3" width="8" height="8" stroke="currentColor" strokeWidth="2"/>
              <rect x="13" y="13" width="8" height="8" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
          <button
            className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            title="Vista de lista"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="4" y1="6" x2="20" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="4" y1="18" x2="20" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Fields Grid/List */}
      <div className={`fields-container ${viewMode}`}>
        {filteredFields.map((field) => (
          <div
            key={field.id}
            className="field-card"
            onClick={() => handleFieldClick(field.id)}
          >
            {/* Field Image */}
            <div className="field-image">
              <div className="image-placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="status-badge" style={{ backgroundColor: getStatusColor(field.status) }}>
                {getStatusText(field.status)}
              </div>
            </div>

            {/* Field Info */}
            <div className="field-info">
              <div className="field-header-info">
                <h3 className="field-name">{field.name}</h3>
                <span className="field-area">{field.area}</span>
              </div>

              <div className="field-location">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span>{field.location}</span>
              </div>

              <div className="field-crop">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2v20M12 2C8 2 5 5 5 9s3 7 7 7M12 2c4 0 7 3 7 7s-3 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span>{field.cropType}</span>
              </div>

              {/* Metrics */}
              <div className="field-metrics">
                <div className="metric">
                  <div className="metric-icon humidity">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="metric-info">
                    <span className="metric-label">Humedad</span>
                    <span className="metric-value">{field.moisture}%</span>
                  </div>
                </div>

                <div className="metric">
                  <div className="metric-icon temperature">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="metric-info">
                    <span className="metric-label">Temperatura</span>
                    <span className="metric-value">{field.temperature}°C</span>
                  </div>
                </div>
              </div>

              {/* Last Update */}
              <div className="field-footer">
                <span className="last-update">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  {field.lastUpdate}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Add New Field Card */}
        <div className="field-card add-new-card" onClick={handleAddNewField}>
          <div className="add-new-content">
            <div className="add-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className="add-new-title">Agregar Nuevo Campo</h3>
            <p className="add-new-description">
              Registra un nuevo campo para comenzar el monitoreo
            </p>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredFields.length === 0 && (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <h3>No se encontraron campos</h3>
          <p>Intenta con otros términos de búsqueda</p>
        </div>
      )}

      {/* Modal de Agregar Campo */}
      <AddFieldModal
        isOpen={showAddFieldModal}
        onClose={() => setShowAddFieldModal(false)}
        onSave={handleSaveField}
      />
    </div>
  );
};

export default FieldSelectionPage;
