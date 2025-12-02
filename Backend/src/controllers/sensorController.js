/**
 * Controlador de Sensores
 * Maneja operaciones CRUD de sensores y lecturas
 */

const Sensor = require('../models/Sensor');
const SensorReading = require('../models/SensorReading');
const Crop = require('../models/Crop');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Obtener todos los sensores
 * @route GET /api/sensors
 * @access Private
 */
exports.getSensors = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, type, crop } = req.query;

    // Construir filtros
    const filters = {};
    if (status) filters.status = status;
    if (type) filters.type = type;
    if (crop) filters.crop_id = crop;

    // Paginación
    const offset = (page - 1) * limit;
    
    const { count, rows: sensors } = await Sensor.findAndCountAll({
      where: filters,
      include: [{
        model: Crop,
        as: 'crop',
        attributes: ['name', 'type', 'field']
      }],
      limit: parseInt(limit),
      offset: offset,
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: sensors.length,
      total: count,
      page: parseInt(page),
      pages: Math.ceil(count / limit),
      data: sensors
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Obtener sensor por ID
 * @route GET /api/sensors/:id
 * @access Private
 */
exports.getSensor = async (req, res, next) => {
  try {
    const sensor = await Sensor.findByPk(req.params.id, {
      include: [{
        model: Crop,
        as: 'crop'
      }]
    });

    if (!sensor) {
      return res.status(404).json({
        success: false,
        message: 'Sensor no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: sensor
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Crear nuevo sensor
 * @route POST /api/sensors
 * @access Private/Admin
 */
exports.createSensor = async (req, res, next) => {
  try {
    // Verificar que el cultivo existe si se proporciona
    if (req.body.crop_id) {
      const crop = await Crop.findByPk(req.body.crop_id);
      if (!crop) {
        return res.status(404).json({
          success: false,
          message: 'Cultivo no encontrado'
        });
      }
    }

    const sensor = await Sensor.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Sensor creado exitosamente',
      data: sensor
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar sensor
 * @route PUT /api/sensors/:id
 * @access Private/Admin
 */
exports.updateSensor = async (req, res, next) => {
  try {
    const sensor = await Sensor.findByPk(req.params.id);

    if (!sensor) {
      return res.status(404).json({
        success: false,
        message: 'Sensor no encontrado'
      });
    }

    await sensor.update(req.body);

    res.status(200).json({
      success: true,
      message: 'Sensor actualizado exitosamente',
      data: sensor
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar sensor
 * @route DELETE /api/sensors/:id
 * @access Private/Admin
 */
exports.deleteSensor = async (req, res, next) => {
  try {
    const sensor = await Sensor.findByPk(req.params.id);

    if (!sensor) {
      return res.status(404).json({
        success: false,
        message: 'Sensor no encontrado'
      });
    }

    // Eliminar también todas las lecturas del sensor
    await SensorReading.destroy({ where: { sensor_id: req.params.id } });

    await sensor.destroy();

    res.status(200).json({
      success: true,
      message: 'Sensor y sus lecturas eliminados exitosamente',
      data: {}
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Recibir datos de sensor (endpoint para IoT)
 * @route POST /api/sensors/:id/data
 * @access Public (con API Key en producción)
 */
exports.receiveSensorData = async (req, res, next) => {
  try {
    const sensor = await Sensor.findByPk(req.params.id);

    if (!sensor) {
      return res.status(404).json({
        success: false,
        message: 'Sensor no encontrado'
      });
    }

    if (sensor.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Sensor no está activo'
      });
    }

    const { temperature, humidity, soil_moisture, light, ph } = req.body;

    // Crear lectura
    const reading = await SensorReading.create({
      sensor_id: sensor.id,
      temperature,
      humidity,
      soil_moisture,
      light,
      ph,
      timestamp: new Date()
    });

    // Actualizar última lectura del sensor
    await sensor.update({
      last_reading: {
        temperature,
        humidity,
        soil_moisture,
        light,
        ph,
        timestamp: new Date()
      }
    });

    // Verificar alertas si hay cultivo asociado
    if (sensor.crop_id) {
      const crop = await Crop.findByPk(sensor.crop_id);
      if (crop) {
        const alerts = checkAlerts({
          temperature,
          humidity,
          soilMoisture: soil_moisture,
          light,
          ph
        }, crop.optimal_conditions);
        
        await reading.update({ alerts });
      }
    }

    res.status(201).json({
      success: true,
      message: 'Datos recibidos exitosamente',
      data: reading
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Obtener lecturas de un sensor
 * @route GET /api/sensors/:id/readings
 * @access Private
 */
exports.getSensorReadings = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, startDate, endDate } = req.query;

    // Construir filtros
    const filters = { sensor_id: req.params.id };
    
    if (startDate || endDate) {
      filters.timestamp = {};
      if (startDate) filters.timestamp[Op.gte] = new Date(startDate);
      if (endDate) filters.timestamp[Op.lte] = new Date(endDate);
    }

    // Paginación
    const offset = (page - 1) * limit;
    
    const { count, rows: readings } = await SensorReading.findAndCountAll({
      where: filters,
      limit: parseInt(limit),
      offset: offset,
      order: [['timestamp', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: readings.length,
      total: count,
      page: parseInt(page),
      pages: Math.ceil(count / limit),
      data: readings
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Obtener lecturas promedio de un sensor
 * @route GET /api/sensors/:id/readings/average
 * @access Private
 */
exports.getSensorAverages = async (req, res, next) => {
  try {
    const { hours = 24 } = req.query;
    
    const timeAgo = new Date(Date.now() - hours * 60 * 60 * 1000);

    const averages = await SensorReading.findAll({
      where: {
        sensor_id: req.params.id,
        timestamp: { [Op.gte]: timeAgo }
      },
      attributes: [
        [sequelize.fn('AVG', sequelize.col('temperature')), 'avgTemperature'],
        [sequelize.fn('AVG', sequelize.col('humidity')), 'avgHumidity'],
        [sequelize.fn('AVG', sequelize.col('soil_moisture')), 'avgSoilMoisture'],
        [sequelize.fn('AVG', sequelize.col('light')), 'avgLight'],
        [sequelize.fn('AVG', sequelize.col('ph')), 'avgPh'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      raw: true
    });

    res.status(200).json({
      success: true,
      data: averages[0] || null
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Verificar si las lecturas están fuera de rango óptimo
 * @param {Object} data - Datos de lectura
 * @param {Object} optimalConditions - Condiciones óptimas del cultivo
 * @returns {Array} Array de alertas
 */
const checkAlerts = (data, optimalConditions) => {
  const alerts = [];

  // Verificar temperatura
  if (data.temperature) {
    if (data.temperature < optimalConditions.temperature.min) {
      alerts.push({
        type: 'warning',
        parameter: 'temperature',
        message: `Temperatura baja: ${data.temperature}°C (óptimo: ${optimalConditions.temperature.min}-${optimalConditions.temperature.max}°C)`
      });
    } else if (data.temperature > optimalConditions.temperature.max) {
      alerts.push({
        type: 'warning',
        parameter: 'temperature',
        message: `Temperatura alta: ${data.temperature}°C (óptimo: ${optimalConditions.temperature.min}-${optimalConditions.temperature.max}°C)`
      });
    }
  }

  // Verificar humedad
  if (data.humidity) {
    if (data.humidity < optimalConditions.humidity.min) {
      alerts.push({
        type: 'warning',
        parameter: 'humidity',
        message: `Humedad baja: ${data.humidity}% (óptimo: ${optimalConditions.humidity.min}-${optimalConditions.humidity.max}%)`
      });
    } else if (data.humidity > optimalConditions.humidity.max) {
      alerts.push({
        type: 'warning',
        parameter: 'humidity',
        message: `Humedad alta: ${data.humidity}% (óptimo: ${optimalConditions.humidity.min}-${optimalConditions.humidity.max}%)`
      });
    }
  }

  // Verificar humedad del suelo
  if (data.soilMoisture) {
    if (data.soilMoisture < optimalConditions.soilMoisture.min) {
      alerts.push({
        type: 'critical',
        parameter: 'soilMoisture',
        message: `Humedad del suelo baja: ${data.soilMoisture}% (óptimo: ${optimalConditions.soilMoisture.min}-${optimalConditions.soilMoisture.max}%)`
      });
    } else if (data.soilMoisture > optimalConditions.soilMoisture.max) {
      alerts.push({
        type: 'warning',
        parameter: 'soilMoisture',
        message: `Humedad del suelo alta: ${data.soilMoisture}% (óptimo: ${optimalConditions.soilMoisture.min}-${optimalConditions.soilMoisture.max}%)`
      });
    }
  }

  return alerts;
};
