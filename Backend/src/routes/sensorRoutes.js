/**
 * Rutas de Sensores
 * Define los endpoints para gestión de sensores y lecturas
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const sensorController = require('../controllers/sensorController');
const { protect, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');

// Validaciones
const createSensorValidation = [
  body('sensor_id').trim().notEmpty().withMessage('El ID del sensor es obligatorio'),
  body('name').trim().notEmpty().withMessage('El nombre del sensor es obligatorio'),
  body('type').isIn(['temperature', 'humidity', 'soil_moisture', 'light', 'ph', 'multi'])
    .withMessage('Tipo de sensor inválido'),
  validate
];

const sensorDataValidation = [
  body('temperature').optional().isFloat().withMessage('Temperatura inválida'),
  body('humidity').optional().isFloat({ min: 0, max: 100 }).withMessage('Humedad inválida'),
  body('soil_moisture').optional().isFloat({ min: 0, max: 100 }).withMessage('Humedad del suelo inválida'),
  body('light').optional().isFloat({ min: 0 }).withMessage('Luminosidad inválida'),
  body('ph').optional().isFloat({ min: 0, max: 14 }).withMessage('pH inválido'),
  validate
];

// Ruta pública para que los sensores envíen datos
router.post('/:id/data', sensorDataValidation, sensorController.receiveSensorData);

// Rutas protegidas
router.use(protect);

router.get('/', sensorController.getSensors);
router.get('/:id', sensorController.getSensor);
router.get('/:id/readings', sensorController.getSensorReadings);
router.get('/:id/readings/average', sensorController.getSensorAverages);

// Solo admin puede crear, actualizar y eliminar sensores
router.post('/', authorize('admin', 'operator'), createSensorValidation, sensorController.createSensor);
router.put('/:id', authorize('admin', 'operator'), sensorController.updateSensor);
router.delete('/:id', authorize('admin'), sensorController.deleteSensor);

module.exports = router;
