/**
 * Middleware de manejo de errores
 * Captura y formatea todos los errores de la aplicación
 */

/**
 * Manejador de errores global
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log del error para debugging
  console.error('Error:', err);

  // Error de validación de Sequelize
  if (err.name === 'SequelizeValidationError') {
    const message = err.errors.map(e => e.message);
    error = {
      statusCode: 400,
      message: message
    };
  }

  // Error de Sequelize - Unique constraint
  if (err.name === 'SequelizeUniqueConstraintError') {
    const field = err.errors[0]?.path || 'campo';
    error = {
      statusCode: 400,
      message: `El ${field} ya existe`
    };
  }

  // Error de Sequelize - Foreign key constraint
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    error = {
      statusCode: 400,
      message: 'Referencia inválida a otro recurso'
    };
  }

  // Error de Sequelize - Database error
  if (err.name === 'SequelizeDatabaseError') {
    error = {
      statusCode: 400,
      message: 'Error en la base de datos'
    };
  }

  // Error de JWT
  if (err.name === 'JsonWebTokenError') {
    error = {
      statusCode: 401,
      message: 'Token inválido'
    };
  }

  // Error de JWT expirado
  if (err.name === 'TokenExpiredError') {
    error = {
      statusCode: 401,
      message: 'Token expirado'
    };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Error del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

/**
 * Manejador para rutas no encontradas
 */
const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.originalUrl}`
  });
};

module.exports = { errorHandler, notFound };
