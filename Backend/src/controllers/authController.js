/**
 * Controlador de Autenticación
 * Maneja registro, login y gestión de tokens
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');

/**
 * Registrar nuevo usuario
 * @route POST /api/auth/register
 * @access Public
 */
exports.register = async (req, res, next) => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      password, 
      companyName
    } = req.body;

    // VALIDACIÓN ESTRICTA: Todos los campos obligatorios deben estar presentes
    if (!firstName || !lastName || !email || !password || !companyName) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos obligatorios deben ser proporcionados'
      });
    }

    // VALIDACIÓN ESTRICTA: No permitir strings vacíos
    if (firstName.trim() === '' || lastName.trim() === '' || 
        email.trim() === '' || password.trim() === '' || companyName.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Los campos no pueden estar vacíos'
      });
    }

    // Generar username automáticamente desde el email (parte antes del @)
    const username = email.split('@')[0].toLowerCase().replace(/[^a-z0-9_-]/g, '_');

    // VALIDACIÓN ESTRICTA: Verificar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'El formato del email es inválido'
      });
    }

    // VALIDACIÓN ESTRICTA: Verificar longitud y complejidad de contraseña
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 8 caracteres'
      });
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe contener al menos un carácter especial'
      });
    }

    // Verificar si el email ya existe
    const emailExists = await User.findOne({ where: { email: email.trim().toLowerCase() } });
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }

    // Crear usuario con TODOS los campos requeridos
    const user = await User.create({
      username: username,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      password: password, // Se encriptará en el hook
      areaOfWork: 'other', // Valor por defecto
      companyName: companyName.trim(),
      companyWebsite: 'https://example.com', // Valor por defecto
      phone: null, // No se solicita
      role: 'user', // Siempre user por defecto
      is_active: true
    });

    // Generar token
    const token = generateToken(user.id);

    // Respuesta que el frontend espera
    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        token
      }
    });

  } catch (error) {
    // Log detallado del error para debugging
    console.error('❌ Error en registro:', error.name, error.message);
    
    // Manejar errores de validación de Sequelize
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: error.errors.map(e => e.message)
      });
    }

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'El username o email ya están registrados'
      });
    }

    if (error.name === 'SequelizeDatabaseError') {
      console.error('   Detalles SQL:', error.original?.message || error.message);
      return res.status(400).json({
        success: false,
        message: 'Error en la base de datos: ' + (error.original?.message || error.message)
      });
    }

    next(error);
  }
};

/**
 * Login de usuario
 * @route POST /api/auth/login
 * @access Public
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // VALIDACIÓN ESTRICTA: email y password son obligatorios
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son obligatorios'
      });
    }

    // VALIDACIÓN ESTRICTA: No permitir strings vacíos
    if (email.trim() === '' || password.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña no pueden estar vacíos'
      });
    }

    // VALIDACIÓN ESTRICTA: Buscar usuario por email (incluir password para verificación)
    const user = await User.findOne({ 
      where: { email: email.trim().toLowerCase() },
      attributes: { include: ['password'] }
    });

    // VALIDACIÓN ESTRICTA: Usuario debe existir
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // VALIDACIÓN ESTRICTA: Verificar si el usuario está activo ANTES de validar password
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Usuario inactivo. Contacte al administrador'
      });
    }

    // VALIDACIÓN ESTRICTA: Verificar password
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Actualizar último login
    await user.update({ last_login: new Date() });

    // Generar token
    const token = generateToken(user.id);

    // Respuesta exacta que el frontend espera: { user, token }
    res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Obtener usuario actual
 * @route GET /api/auth/me
 * @access Private
 */
exports.getMe = async (req, res, next) => {
  try {
    // VALIDACIÓN ESTRICTA: req.user debe existir (viene del middleware protect)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado'
      });
    }

    const user = await User.findByPk(req.user.id);

    // VALIDACIÓN ESTRICTA: Verificar que el usuario aún existe
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Respuesta en formato que el frontend espera
    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.created_at
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Logout (invalidar token en el cliente)
 * @route POST /api/auth/logout
 * @access Private
 */
exports.logout = async (req, res, next) => {
  try {
    // En una implementación real, aquí podrías agregar el token a una blacklist
    // Por ahora, el cliente simplemente elimina el token
    
    res.status(200).json({
      success: true,
      message: 'Logout exitoso'
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Generar JWT Token
 * @param {string} id - User ID
 * @returns {string} JWT Token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn
  });
};
