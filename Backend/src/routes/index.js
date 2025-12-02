/**
 * Archivo principal de rutas
 * Centraliza todas las rutas de la aplicación
 */

const express = require('express');
const router = express.Router();

// Importar rutas
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const cropRoutes = require('./cropRoutes');
const sensorRoutes = require('./sensorRoutes');

// Definir rutas
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/crops', cropRoutes);
router.use('/sensors', sensorRoutes);

// Ruta de salud del servidor
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
