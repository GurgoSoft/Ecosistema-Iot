/**
 * Controlador de Usuarios
 * Maneja operaciones CRUD de usuarios
 */

const User = require('../models/User');

/**
 * Obtener todos los usuarios
 * @route GET /api/users
 * @access Private/Admin
 */
exports.getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, role, isActive } = req.query;

    // Construir filtros
    const filters = {};
    if (role) filters.role = role;
    if (isActive !== undefined) filters.is_active = isActive === 'true';

    // Paginación
    const offset = (page - 1) * limit;
    
    const { count, rows: users } = await User.findAndCountAll({
      where: filters,
      limit: parseInt(limit),
      offset: offset,
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: users.length,
      total: count,
      page: parseInt(page),
      pages: Math.ceil(count / limit),
      data: users
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Obtener usuario por ID
 * @route GET /api/users/:id
 * @access Private
 */
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar usuario
 * @route PUT /api/users/:id
 * @access Private
 */
exports.updateUser = async (req, res, next) => {
  try {
    const { name, email, phone, address, role, isActive } = req.body;

    // Solo el usuario mismo o un admin pueden actualizar
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para actualizar este usuario'
      });
    }

    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name;
    if (email) fieldsToUpdate.email = email;
    if (phone) fieldsToUpdate.phone = phone;
    if (address) fieldsToUpdate.address = address;
    
    // Solo admin puede cambiar role e isActive
    if (req.user.role === 'admin') {
      if (role) fieldsToUpdate.role = role;
      if (isActive !== undefined) fieldsToUpdate.isActive = isActive;
    }

    fieldsToUpdate.updatedAt = Date.now();

    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    await user.update(fieldsToUpdate);

    res.status(200).json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: user
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar usuario
 * @route DELETE /api/users/:id
 * @access Private/Admin
 */
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // No permitir que el usuario se elimine a sí mismo
    if (req.user.id === req.params.id) {
      return res.status(400).json({
        success: false,
        message: 'No puedes eliminar tu propia cuenta'
      });
    }

    await user.destroy();

    res.status(200).json({
      success: true,
      message: 'Usuario eliminado exitosamente',
      data: {}
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar contraseña
 * @route PUT /api/users/:id/password
 * @access Private
 */
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Solo el usuario mismo puede cambiar su contraseña
    if (req.user.id !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado'
      });
    }

    const user = await User.findByPk(req.params.id, {
      attributes: { include: ['password'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Verificar contraseña actual
    const isPasswordMatch = await user.comparePassword(currentPassword);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Contraseña actual incorrecta'
      });
    }

    // Actualizar contraseña
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });

  } catch (error) {
    next(error);
  }
};
