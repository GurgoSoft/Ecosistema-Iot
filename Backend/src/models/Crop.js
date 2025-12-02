/**
 * Modelo de Cultivo
 * Define el esquema para la gestión de cultivos agrícolas con Sequelize
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Crop = sequelize.define('crops', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  
  // Información básica del cultivo
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El nombre del cultivo es obligatorio' },
      len: { args: [1, 100], msg: 'El nombre no puede exceder 100 caracteres' }
    }
  },
  
  type: {
    type: DataTypes.ENUM('cereal', 'legumbre', 'hortaliza', 'fruta', 'otro'),
    allowNull: false,
    defaultValue: 'otro'
  },
  
  // Ubicación
  field: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El campo es obligatorio' }
    }
  },
  
  area: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: { args: [0], msg: 'El área debe ser positiva' }
    }
  },
  
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  },
  
  // Fechas importantes
  planting_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: { msg: 'Fecha de siembra inválida' }
    }
  },
  
  expected_harvest_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: { msg: 'Fecha estimada de cosecha inválida' }
    }
  },
  
  actual_harvest_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  
  // Estado del cultivo
  status: {
    type: DataTypes.ENUM('planted', 'growing', 'ready', 'harvested', 'failed'),
    defaultValue: 'planted',
    allowNull: false
  },
  
  // Condiciones óptimas (almacenadas como JSON)
  optimal_conditions: {
    type: DataTypes.JSONB,
    defaultValue: {
      temperature: { min: 15, max: 30 },
      humidity: { min: 40, max: 70 },
      soilMoisture: { min: 30, max: 60 }
    }
  },
  
  // Información adicional
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  
  // Usuario responsable (foreign key)
  owner_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['owner_id', 'status'] },
    { fields: ['planting_date'] }
  ]
});

module.exports = Crop;
