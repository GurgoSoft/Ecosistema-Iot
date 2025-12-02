/**
 * Rutas de Usuarios
 * Define los endpoints para gestión de usuarios
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');

// Validaciones
const updateUserValidation = [
  body('name').optional().trim().notEmpty().withMessage('El nombre no puede estar vacío'),
  body('email').optional().isEmail().withMessage('Email inválido').normalizeEmail(),
  body('phone').optional().trim(),
  body('address').optional().trim(),
  validate
];

const updatePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('La contraseña actual es obligatoria'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('La nueva contraseña debe tener al menos 6 caracteres'),
  validate
];

// Todas las rutas requieren autenticación
router.use(protect);

// Rutas de usuarios
router.get('/', authorize('admin'), userController.getUsers);
router.get('/:id', userController.getUser);
router.put('/:id', updateUserValidation, userController.updateUser);
router.delete('/:id', authorize('admin'), userController.deleteUser);
router.put('/:id/password', updatePasswordValidation, userController.updatePassword);

module.exports = router;
