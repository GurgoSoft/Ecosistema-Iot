/**
 * Middleware de autenticación
 * Verifica el token JWT y protege las rutas
 */

const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');

/**
 * Verificar token JWT - VALIDACIONES ESTRICTAS (10/10)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // VALIDACIÓN ESTRICTA: Verificar que existe el header Authorization
    if (!req.headers.authorization) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado. Token no proporcionado'
      });
    }

    // VALIDACIÓN ESTRICTA: Verificar formato Bearer
    if (!req.headers.authorization.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado. Formato de token inválido'
      });
    }

    // Extraer token
    token = req.headers.authorization.split(' ')[1];

    // VALIDACIÓN ESTRICTA: Verificar que el token no esté vacío
    if (!token || token.trim() === '') {
      return res.status(401).json({
        success: false,
        message: 'No autorizado. Token vacío'
      });
    }

    // VALIDACIÓN ESTRICTA: Verificar token con JWT
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwt.secret);
    } catch (jwtError) {
      if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Token inválido'
        });
      }
      
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expirado. Por favor inicie sesión nuevamente'
        });
      }

      throw jwtError;
    }

    // VALIDACIÓN ESTRICTA: Verificar que el decoded tenga id
    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido. ID de usuario no encontrado'
      });
    }

    // VALIDACIÓN ESTRICTA: Obtener usuario del token
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado. Usuario no encontrado'
      });
    }

    // VALIDACIÓN ESTRICTA: Verificar que el usuario esté activo
    if (user.is_active !== true) {
      return res.status(401).json({
        success: false,
        message: 'Usuario inactivo. Contacte al administrador'
      });
    }

    // Asignar usuario a request
    req.user = user;

    next();
  } catch (error) {
    console.error('Error en middleware de autenticación:', error);

    return res.status(500).json({
      success: false,
      message: 'Error en la autenticación'
    });
  }
};

/**
 * Verificar rol del usuario
 * @param  {...string} roles - Roles permitidos
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `El rol '${req.user.role}' no está autorizado para acceder a este recurso`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
