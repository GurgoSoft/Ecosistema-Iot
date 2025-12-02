/**
 * Middleware de validación
 * Valida los datos de entrada de las peticiones
 */

const { validationResult } = require('express-validator');

/**
 * Verifica los resultados de la validación
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  
  next();
};

module.exports = validate;
