const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Inventory = sequelize.define('Inventory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantity: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: false
  },
  minStock: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  location: {
    type: DataTypes.STRING
  },
  lastRestocked: {
    type: DataTypes.DATE
  }
}, {
  timestamps: true
});

module.exports = Inventory;
