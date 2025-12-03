/**
 * Rutas de Autenticación
 * Define los endpoints para registro, login y gestión de sesión
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/auth');
const validate = require('../middlewares/validate');

// VALIDACIONES ESTRICTAS (10/10)
const registerValidation = [
  // Username: obligatorio, sin espacios, 3-50 caracteres
  body('username')
    .trim()
    .notEmpty().withMessage('El username es obligatorio')
    .isLength({ min: 3, max: 50 }).withMessage('El username debe tener entre 3 y 50 caracteres')
    .matches(/^[a-zA-Z0-9_-]+$/).withMessage('El username solo puede contener letras, números, guiones y guiones bajos sin espacios'),
  
  // Nombres: obligatorios, no vacíos
  body('firstName')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 1, max: 50 }).withMessage('El nombre no puede exceder 50 caracteres'),
  
  body('lastName')
    .trim()
    .notEmpty().withMessage('El apellido es obligatorio')
    .isLength({ min: 1, max: 50 }).withMessage('El apellido no puede exceder 50 caracteres'),
  
  // Email: obligatorio, formato válido
  body('email')
    .trim()
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Email inválido')
    .normalizeEmail(),
  
  // Password: obligatorio, mínimo 8 caracteres, debe contener carácter especial
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('La contraseña debe contener al menos un carácter especial'),
  
  // Área de trabajo: obligatoria, debe ser una opción válida
  body('areaOfWork')
    .trim()
    .notEmpty().withMessage('El área de trabajo es obligatoria')
    .isIn(['technology', 'manufacturing', 'healthcare', 'education', 'finance', 'agriculture', 'energy', 'transportation', 'other'])
    .withMessage('Área de trabajo inválida'),
  
  // Nombre de compañía: obligatorio
  body('companyName')
    .trim()
    .notEmpty().withMessage('El nombre de la compañía es obligatorio')
    .isLength({ min: 1, max: 100 }).withMessage('El nombre de la compañía no puede exceder 100 caracteres'),
  
  // Sitio web de compañía: obligatorio, formato URL válido
  body('companyWebsite')
    .trim()
    .notEmpty().withMessage('El sitio web de la compañía es obligatorio')
    .isURL().withMessage('El sitio web debe ser una URL válida'),
  
  // Teléfono: opcional
  body('phone')
    .optional()
    .trim(),
  
  validate
];

const loginValidation = [
  // Username: obligatorio, no vacío
  body('username')
    .trim()
    .notEmpty().withMessage('El username es obligatorio'),
  
  // Password: obligatorio, no vacío
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria'),
  
  validate
];

// Rutas públicas
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);

// Rutas protegidas
router.get('/me', protect, authController.getMe);
router.post('/logout', protect, authController.logout);

module.exports = router;
