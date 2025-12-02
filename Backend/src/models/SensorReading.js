/**
 * Modelo de Lectura de Sensor
 * Almacena el historial de lecturas de los sensores con Sequelize
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SensorReading = sequelize.define('sensor_readings', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  
  // Sensor que realiza la lectura (foreign key)
  sensor_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'sensors',
      key: 'id'
    }
  },
  
  // Datos de la lectura
  temperature: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    validate: {
      min: { args: [-50], msg: 'Temperatura fuera de rango' },
      max: { args: [100], msg: 'Temperatura fuera de rango' }
    }
  },
  
  humidity: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    validate: {
      min: { args: [0], msg: 'Humedad fuera de rango' },
      max: { args: [100], msg: 'Humedad fuera de rango' }
    }
  },
  
  soil_moisture: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    validate: {
      min: { args: [0], msg: 'Humedad del suelo fuera de rango' },
      max: { args: [100], msg: 'Humedad del suelo fuera de rango' }
    }
  },
  
  light: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: { args: [0], msg: 'Luminosidad debe ser positiva' }
    }
  },
  
  ph: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: true,
    validate: {
      min: { args: [0], msg: 'pH fuera de rango' },
      max: { args: [14], msg: 'pH fuera de rango' }
    }
  },
  
  // Timestamp de la lectura
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  
  // Alertas generadas por esta lectura (almacenadas como JSON)
  alerts: {
    type: DataTypes.JSONB,
    defaultValue: []
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false, // No necesitamos updated_at para lecturas
  indexes: [
    { fields: ['sensor_id', 'timestamp'] },
    { fields: ['timestamp'] }
  ]
});

module.exports = SensorReading;
