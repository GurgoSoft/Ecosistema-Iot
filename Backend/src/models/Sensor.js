/**
 * Modelo de Sensor
 * Define el esquema para dispositivos IoT y sus lecturas con Sequelize
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Sensor = sequelize.define('sensors', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  
  // Información del sensor
  sensor_id: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: { msg: 'El ID del sensor es obligatorio' }
    }
  },
  
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El nombre del sensor es obligatorio' }
    }
  },
  
  type: {
    type: DataTypes.ENUM('temperature', 'humidity', 'soil_moisture', 'light', 'ph', 'multi'),
    allowNull: false,
    defaultValue: 'multi'
  },
  
  // Ubicación del sensor
  field: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  },
  
  // Cultivo asociado (foreign key)
  crop_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'crops',
      key: 'id'
    }
  },
  
  // Estado del sensor
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'maintenance', 'error'),
    defaultValue: 'active',
    allowNull: false
  },
  
  // Última lectura (almacenada como JSON)
  last_reading: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  
  // Configuración
  reading_interval: {
    type: DataTypes.INTEGER,
    defaultValue: 300, // 5 minutos en segundos
    comment: 'Intervalo de lectura en segundos'
  },
  
  // Metadatos
  installed_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  
  last_maintenance: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['sensor_id'], unique: true },
    { fields: ['crop_id', 'status'] }
  ]
});

module.exports = Sensor;
