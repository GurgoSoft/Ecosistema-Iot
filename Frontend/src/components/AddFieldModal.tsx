import React, { useState } from 'react';
import './AddFieldModal.css';

interface SoilAnalysis {
  type: string;
  ph: number;
  moisture: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organicMatter: number;
}

interface CropRecommendation {
  name: string;
  growthTime: string;
  suitability: number;
  waterNeed: string;
  icon: string;
}

interface AddFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (fieldData: any) => void;
}

const AddFieldModal: React.FC<AddFieldModalProps> = ({ isOpen, onClose, onSave }) => {
  const [step, setStep] = useState(1); // 1: Info básica, 2: Ubicación/Mapa, 3: Análisis de suelo
  const [fieldName, setFieldName] = useState('');
  const [fieldArea, setFieldArea] = useState('');
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const [address, setAddress] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(false);
  
  // Análisis de suelo simulado
  const [soilAnalysis] = useState<SoilAnalysis>({
    type: 'Franco arcilloso',
    ph: 6.8,
    moisture: 72,
    nitrogen: 85,
    phosphorus: 68,
    potassium: 75,
    organicMatter: 4.2
  });

  // Recomendaciones de cultivos
  const [cropRecommendations] = useState<CropRecommendation[]>([
    { name: 'Maíz', growthTime: '90-120 días', suitability: 95, waterNeed: 'Media', icon: 'corn' },
    { name: 'Trigo', growthTime: '100-130 días', suitability: 88, waterNeed: 'Media', icon: 'wheat' },
    { name: 'Tomate', growthTime: '70-90 días', suitability: 92, waterNeed: 'Alta', icon: 'tomato' },
    { name: 'Soja', growthTime: '100-140 días', suitability: 85, waterNeed: 'Media-Baja', icon: 'soybean' },
    { name: 'Lechuga', growthTime: '45-60 días', suitability: 78, waterNeed: 'Media', icon: 'lettuce' },
    { name: 'Papa', growthTime: '90-120 días', suitability: 90, waterNeed: 'Media', icon: 'potato' }
  ]);

  const [selectedCrop, setSelectedCrop] = useState<string>('');

  if (!isOpen) return null;

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Simular coordenadas (esto se reemplazaría con coordenadas reales de un mapa)
    const lat = 40.7128 + (Math.random() - 0.5) * 0.1;
    const lng = -74.0060 + (Math.random() - 0.5) * 0.1;
    
    setLocation({ lat, lng });
    setAddress(`Sector ${Math.floor(Math.random() * 10) + 1}, Zona Agrícola`);
    setSelectedLocation(true);
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSave = () => {
    const fieldData = {
      name: fieldName,
      area: fieldArea,
      location: address,
      coordinates: location,
      cropType: selectedCrop,
      soilAnalysis,
      status: 'good'
    };
    onSave(fieldData);
    handleClose();
  };

  const handleClose = () => {
    setStep(1);
    setFieldName('');
    setFieldArea('');
    setSelectedLocation(false);
    setSelectedCrop('');
    onClose();
  };

  const getSuitabilityColor = (value: number) => {
    if (value >= 90) return '#10b981';
    if (value >= 75) return '#3b82f6';
    if (value >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getCropIcon = (iconName: string) => {
    const icons: { [key: string]: JSX.Element } = {
      corn: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L8 6L12 10L16 6L12 2Z" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5"/>
          <path d="M8 6L6 10L8 14L10 10L8 6Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5"/>
          <path d="M16 6L14 10L16 14L18 10L16 6Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5"/>
          <path d="M10 10L8 14L10 18L12 14L10 10Z" fill="#fcd34d" stroke="#d97706" strokeWidth="1.5"/>
          <path d="M14 10L12 14L14 18L16 14L14 10Z" fill="#fcd34d" stroke="#d97706" strokeWidth="1.5"/>
          <rect x="11" y="18" width="2" height="4" fill="#65a30d" stroke="#4d7c0f" strokeWidth="1.5"/>
        </svg>
      ),
      wheat: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22V8M12 8C10 8 9 6 9 4M12 8C14 8 15 6 15 4" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round"/>
          <ellipse cx="9" cy="10" rx="2" ry="1" fill="#fbbf24"/>
          <ellipse cx="15" cy="10" rx="2" ry="1" fill="#fbbf24"/>
          <ellipse cx="9" cy="13" rx="2" ry="1" fill="#fcd34d"/>
          <ellipse cx="15" cy="13" rx="2" ry="1" fill="#fcd34d"/>
          <ellipse cx="9" cy="16" rx="2" ry="1" fill="#fde68a"/>
          <ellipse cx="15" cy="16" rx="2" ry="1" fill="#fde68a"/>
        </svg>
      ),
      tomato: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="13" r="7" fill="#ef4444" stroke="#dc2626" strokeWidth="1.5"/>
          <path d="M12 6C12 6 10 4 10 3C10 2 11 2 12 2C13 2 14 2 14 3C14 4 12 6 12 6Z" fill="#22c55e" stroke="#16a34a" strokeWidth="1.5"/>
          <circle cx="10" cy="11" r="1" fill="#fca5a5" opacity="0.6"/>
        </svg>
      ),
      soybean: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 3C8 3 6 6 6 9C6 12 8 15 12 15C16 15 18 12 18 9C18 6 16 3 12 3Z" fill="#84cc16" stroke="#65a30d" strokeWidth="1.5"/>
          <circle cx="9" cy="9" r="2" fill="#a3e635" stroke="#65a30d" strokeWidth="1"/>
          <circle cx="15" cy="9" r="2" fill="#a3e635" stroke="#65a30d" strokeWidth="1"/>
          <path d="M12 15V21" stroke="#65a30d" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      lettuce: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 4C9 4 7 6 6 8C5 10 5 12 6 14C7 16 9 18 12 18C15 18 17 16 18 14C19 12 19 10 18 8C17 6 15 4 12 4Z" fill="#22c55e" stroke="#16a34a" strokeWidth="1.5"/>
          <path d="M9 8C8 9 8 11 9 12" stroke="#86efac" strokeWidth="1" strokeLinecap="round"/>
          <path d="M15 8C16 9 16 11 15 12" stroke="#86efac" strokeWidth="1" strokeLinecap="round"/>
          <path d="M12 18V21" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      potato: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="12" cy="12" rx="7" ry="5" fill="#a16207" stroke="#854d0e" strokeWidth="1.5"/>
          <circle cx="9" cy="11" r="0.8" fill="#78350f"/>
          <circle cx="14" cy="10" r="0.8" fill="#78350f"/>
          <circle cx="11" cy="14" r="0.8" fill="#78350f"/>
          <circle cx="15" cy="13" r="0.8" fill="#78350f"/>
        </svg>
      )
    };
    return icons[iconName] || icons.corn;
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="add-field-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-section">
            <h2 className="modal-title">Agregar Nuevo Campo</h2>
            <p className="modal-subtitle">
              {step === 1 && 'Información básica del campo'}
              {step === 2 && 'Selecciona la ubicación en el mapa'}
              {step === 3 && 'Análisis de suelo y recomendaciones'}
            </p>
          </div>
          <button className="modal-close-button" onClick={handleClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Progress Steps */}
        <div className="modal-steps">
          <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <div className="step-circle">
              {step > 1 ? '✓' : '1'}
            </div>
            <span className="step-label">Información</span>
          </div>
          <div className={`step-line ${step > 1 ? 'active' : ''}`}></div>
          <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
            <div className="step-circle">
              {step > 2 ? '✓' : '2'}
            </div>
            <span className="step-label">Ubicación</span>
          </div>
          <div className={`step-line ${step > 2 ? 'active' : ''}`}></div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-circle">3</div>
            <span className="step-label">Análisis</span>
          </div>
        </div>

        {/* Content */}
        <div className="modal-content">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="step-content">
              <div className="form-group-modal">
                <label className="form-label-modal">Nombre del Campo *</label>
                <input
                  type="text"
                  className="form-input-modal"
                  placeholder="ej. Campo Norte, Sector A"
                  value={fieldName}
                  onChange={(e) => setFieldName(e.target.value)}
                />
              </div>

              <div className="form-group-modal">
                <label className="form-label-modal">Área Total *</label>
                <div className="input-with-unit">
                  <input
                    type="number"
                    className="form-input-modal"
                    placeholder="0.0"
                    value={fieldArea}
                    onChange={(e) => setFieldArea(e.target.value)}
                  />
                  <span className="input-unit">hectáreas</span>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <p>En el siguiente paso podrás seleccionar la ubicación exacta del campo en el mapa.</p>
              </div>
            </div>
          )}

          {/* Step 2: Map Location */}
          {step === 2 && (
            <div className="step-content">
              <div className="map-container" onClick={handleMapClick}>
                {!selectedLocation ? (
                  <div className="map-placeholder">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <p className="map-instruction">Haz clic en el mapa para seleccionar la ubicación</p>
                  </div>
                ) : (
                  <div className="map-with-marker">
                    <div className="map-marker">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="#ef4444" stroke="#991b1b" strokeWidth="2"/>
                        <circle cx="12" cy="10" r="3" fill="white"/>
                      </svg>
                    </div>
                    <div className="map-grid"></div>
                  </div>
                )}
              </div>

              {selectedLocation && (
                <div className="location-details">
                  <div className="location-item">
                    <span className="location-label">Dirección:</span>
                    <span className="location-value">{address}</span>
                  </div>
                  <div className="location-item">
                    <span className="location-label">Coordenadas:</span>
                    <span className="location-value">
                      {location.lat.toFixed(4)}°N, {location.lng.toFixed(4)}°W
                    </span>
                  </div>
                </div>
              )}

              <div className="info-card warning">
                <div className="info-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <p>Asegúrate de seleccionar la ubicación correcta. Se realizará un análisis del suelo basado en esta posición.</p>
              </div>
            </div>
          )}

          {/* Step 3: Soil Analysis */}
          {step === 3 && (
            <div className="step-content">
              {/* Soil Type Card */}
              <div className="analysis-card soil-type">
                <div className="analysis-header">
                  <h3 className="analysis-title">Tipo de Suelo</h3>
                  <span className="soil-badge">{soilAnalysis.type}</span>
                </div>
                <p className="analysis-description">
                  Suelo con excelente retención de agua y nutrientes, ideal para la mayoría de cultivos.
                </p>
              </div>

              {/* Soil Metrics */}
              <div className="soil-metrics">
                <div className="metric-card">
                  <div className="metric-header">
                    <span className="metric-name">pH del Suelo</span>
                    <span className="metric-value">{soilAnalysis.ph}</span>
                  </div>
                  <div className="metric-bar-container">
                    <div className="metric-bar-fill" style={{ width: `${(soilAnalysis.ph / 14) * 100}%`, background: '#3b82f6' }}></div>
                  </div>
                  <span className="metric-status">Ligeramente ácido - Óptimo</span>
                </div>

                <div className="metric-card">
                  <div className="metric-header">
                    <span className="metric-name">Humedad</span>
                    <span className="metric-value">{soilAnalysis.moisture}%</span>
                  </div>
                  <div className="metric-bar-container">
                    <div className="metric-bar-fill" style={{ width: `${soilAnalysis.moisture}%`, background: '#06b6d4' }}></div>
                  </div>
                  <span className="metric-status">Nivel ideal de humedad</span>
                </div>

                <div className="metric-card">
                  <div className="metric-header">
                    <span className="metric-name">Nitrógeno (N)</span>
                    <span className="metric-value">{soilAnalysis.nitrogen}%</span>
                  </div>
                  <div className="metric-bar-container">
                    <div className="metric-bar-fill" style={{ width: `${soilAnalysis.nitrogen}%`, background: '#10b981' }}></div>
                  </div>
                  <span className="metric-status">Alto contenido</span>
                </div>

                <div className="metric-card">
                  <div className="metric-header">
                    <span className="metric-name">Fósforo (P)</span>
                    <span className="metric-value">{soilAnalysis.phosphorus}%</span>
                  </div>
                  <div className="metric-bar-container">
                    <div className="metric-bar-fill" style={{ width: `${soilAnalysis.phosphorus}%`, background: '#8b5cf6' }}></div>
                  </div>
                  <span className="metric-status">Medio-Alto</span>
                </div>

                <div className="metric-card">
                  <div className="metric-header">
                    <span className="metric-name">Potasio (K)</span>
                    <span className="metric-value">{soilAnalysis.potassium}%</span>
                  </div>
                  <div className="metric-bar-container">
                    <div className="metric-bar-fill" style={{ width: `${soilAnalysis.potassium}%`, background: '#f59e0b' }}></div>
                  </div>
                  <span className="metric-status">Alto contenido</span>
                </div>

                <div className="metric-card">
                  <div className="metric-header">
                    <span className="metric-name">Materia Orgánica</span>
                    <span className="metric-value">{soilAnalysis.organicMatter}%</span>
                  </div>
                  <div className="metric-bar-container">
                    <div className="metric-bar-fill" style={{ width: `${(soilAnalysis.organicMatter / 10) * 100}%`, background: '#84cc16' }}></div>
                  </div>
                  <span className="metric-status">Excelente nivel</span>
                </div>
              </div>

              {/* Crop Recommendations */}
              <div className="recommendations-section">
                <h3 className="section-title">Cultivos Recomendados</h3>
                <p className="section-subtitle">Basado en las condiciones del suelo y clima de la región</p>

                <div className="crop-grid">
                  {cropRecommendations.map((crop, index) => (
                    <div
                      key={index}
                      className={`crop-card ${selectedCrop === crop.name ? 'selected' : ''}`}
                      onClick={() => setSelectedCrop(crop.name)}
                    >
                      <div className="crop-icon">{getCropIcon(crop.icon)}</div>
                      <h4 className="crop-name">{crop.name}</h4>
                      <div className="crop-suitability">
                        <div className="suitability-bar-bg">
                          <div
                            className="suitability-bar"
                            style={{
                              width: `${crop.suitability}%`,
                              background: getSuitabilityColor(crop.suitability)
                            }}
                          ></div>
                        </div>
                        <span className="suitability-value" style={{ color: getSuitabilityColor(crop.suitability) }}>
                          {crop.suitability}% compatible
                        </span>
                      </div>
                      <div className="crop-details">
                        <div className="crop-detail">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                            <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                          <span>{crop.growthTime}</span>
                        </div>
                        <div className="crop-detail">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                          <span>Agua: {crop.waterNeed}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button
            className="modal-button secondary"
            onClick={step === 1 ? handleClose : handleBack}
          >
            {step === 1 ? 'Cancelar' : 'Atrás'}
          </button>
          <button
            className="modal-button primary"
            onClick={step === 3 ? handleSave : handleNext}
            disabled={
              (step === 1 && (!fieldName || !fieldArea)) ||
              (step === 2 && !selectedLocation) ||
              (step === 3 && !selectedCrop)
            }
          >
            {step === 3 ? 'Crear Campo' : 'Siguiente'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFieldModal;
