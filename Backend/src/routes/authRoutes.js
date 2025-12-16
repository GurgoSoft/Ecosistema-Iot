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
  
  // Nombre de compañía: obligatorio
  body('companyName')
    .trim()
    .notEmpty().withMessage('El nombre de la compañía es obligatorio')
    .isLength({ min: 1, max: 100 }).withMessage('El nombre de la compañía no puede exceder 100 caracteres'),
  
  validate
];

const loginValidation = [
  // Email: obligatorio, formato válido
  body('email')
    .trim()
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Email inválido')
    .normalizeEmail(),
  
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
