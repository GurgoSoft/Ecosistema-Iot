/**
 * Rutas de Cultivos
 * Define los endpoints para gestión de cultivos
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const cropController = require('../controllers/cropController');
const { protect } = require('../middlewares/auth');
const validate = require('../middlewares/validate');

// Validaciones
const createCropValidation = [
  body('name').trim().notEmpty().withMessage('El nombre del cultivo es obligatorio'),
  body('type').isIn(['cereal', 'legumbre', 'hortaliza', 'fruta', 'otro'])
    .withMessage('Tipo de cultivo inválido'),
  body('field').trim().notEmpty().withMessage('El campo es obligatorio'),
  body('area').isFloat({ min: 0 }).withMessage('El área debe ser un número positivo'),
  body('planting_date').isISO8601().withMessage('Fecha de siembra inválida'),
  body('expected_harvest_date').isISO8601().withMessage('Fecha de cosecha inválida'),
  validate
];

const updateCropValidation = [
  body('name').optional().trim().notEmpty().withMessage('El nombre no puede estar vacío'),
  body('type').optional().isIn(['cereal', 'legumbre', 'hortaliza', 'fruta', 'otro'])
    .withMessage('Tipo de cultivo inválido'),
  body('status').optional().isIn(['planted', 'growing', 'ready', 'harvested', 'failed'])
    .withMessage('Estado inválido'),
  validate
];

// Todas las rutas requieren autenticación
router.use(protect);

// Rutas de cultivos
router.get('/stats', cropController.getCropStats);
router.get('/', cropController.getCrops);
router.get('/:id', cropController.getCrop);
router.post('/', createCropValidation, cropController.createCrop);
router.put('/:id', updateCropValidation, cropController.updateCrop);
router.delete('/:id', cropController.deleteCrop);

module.exports = router;
