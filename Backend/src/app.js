/**
 * Configuración de la aplicación Express
 * Define middlewares y configuración general
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const config = require('./config/config');
const { errorHandler, notFound } = require('./middlewares/errorHandler');

/**
 * Crear y configurar aplicación Express
 */
const createApp = () => {
  const app = express();

  // Middlewares de seguridad
  app.use(helmet()); // Seguridad HTTP headers
  app.use(cors(config.cors)); // CORS

  // Middlewares de parsing
  app.use(express.json()); // Parse JSON bodies
  app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

  // Middleware de compresión
  app.use(compression());

  // Middleware de logging
  if (config.server.env === 'development') {
    app.use(morgan('dev'));
  } else {
    app.use(morgan('combined'));
  }

  // Rutas
  const routes = require('./routes');
  app.use('/api', routes);

  // Ruta raíz
  app.get('/', (req, res) => {
    res.json({
      success: true,
      message: 'Agriculture Backend API',
      version: '1.0.0',
      documentation: '/api/health'
    });
  });

  // Middleware de error 404
  app.use(notFound);

  // Middleware de manejo de errores
  app.use(errorHandler);

  return app;
};

module.exports = createApp;
