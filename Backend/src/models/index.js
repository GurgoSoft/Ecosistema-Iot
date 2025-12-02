/**
 * Definición de relaciones entre modelos
 * Configura las asociaciones de Sequelize
 */

const User = require('./User');
const Crop = require('./Crop');
const Sensor = require('./Sensor');
const SensorReading = require('./SensorReading');

/**
 * Definir relaciones entre modelos
 */
const setupAssociations = () => {
  // Un usuario tiene muchos cultivos
  User.hasMany(Crop, {
    foreignKey: 'owner_id',
    as: 'crops',
    onDelete: 'CASCADE'
  });

  // Un cultivo pertenece a un usuario
  Crop.belongsTo(User, {
    foreignKey: 'owner_id',
    as: 'owner'
  });

  // Un cultivo tiene muchos sensores
  Crop.hasMany(Sensor, {
    foreignKey: 'crop_id',
    as: 'sensors',
    onDelete: 'SET NULL'
  });

  // Un sensor pertenece a un cultivo (opcional)
  Sensor.belongsTo(Crop, {
    foreignKey: 'crop_id',
    as: 'crop'
  });

  // Un sensor tiene muchas lecturas
  Sensor.hasMany(SensorReading, {
    foreignKey: 'sensor_id',
    as: 'readings',
    onDelete: 'CASCADE'
  });

  // Una lectura pertenece a un sensor
  SensorReading.belongsTo(Sensor, {
    foreignKey: 'sensor_id',
    as: 'sensor'
  });

  console.log('✅ Asociaciones de modelos configuradas');
};

module.exports = {
  User,
  Crop,
  Sensor,
  SensorReading,
  setupAssociations
};
