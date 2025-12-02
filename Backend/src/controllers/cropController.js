/**
 * Controlador de Cultivos
 * Maneja operaciones CRUD de cultivos agrícolas
 */

const Crop = require('../models/Crop');
const User = require('../models/User');
const { Op } = require('sequelize');

/**
 * Obtener todos los cultivos
 * @route GET /api/crops
 * @access Private
 */
exports.getCrops = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, type } = req.query;

    // Construir filtros
    const filters = {};
    
    // Los usuarios regulares solo ven sus cultivos, admin ve todos
    if (req.user.role !== 'admin') {
      filters.owner_id = req.user.id;
    }
    
    if (status) filters.status = status;
    if (type) filters.type = type;

    // Paginación
    const offset = (page - 1) * limit;
    
    const { count, rows: crops } = await Crop.findAndCountAll({
      where: filters,
      include: [{
        model: User,
        as: 'owner',
        attributes: ['name', 'email']
      }],
      limit: parseInt(limit),
      offset: offset,
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: crops.length,
      total: count,
      page: parseInt(page),
      pages: Math.ceil(count / limit),
      data: crops
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Obtener cultivo por ID
 * @route GET /api/crops/:id
 * @access Private
 */
exports.getCrop = async (req, res, next) => {
  try {
    const crop = await Crop.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'owner',
        attributes: ['name', 'email']
      }]
    });

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Cultivo no encontrado'
      });
    }

    // Verificar que el usuario tenga acceso al cultivo
    if (req.user.role !== 'admin' && crop.owner_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para ver este cultivo'
      });
    }

    res.status(200).json({
      success: true,
      data: crop
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Crear nuevo cultivo
 * @route POST /api/crops
 * @access Private
 */
exports.createCrop = async (req, res, next) => {
  try {
    // Agregar el usuario como owner
    req.body.owner_id = req.user.id;

    const crop = await Crop.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Cultivo creado exitosamente',
      data: crop
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar cultivo
 * @route PUT /api/crops/:id
 * @access Private
 */
exports.updateCrop = async (req, res, next) => {
  try {
    let crop = await Crop.findByPk(req.params.id);

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Cultivo no encontrado'
      });
    }

    // Verificar que el usuario sea el owner o admin
    if (req.user.role !== 'admin' && crop.owner_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para actualizar este cultivo'
      });
    }

    // No permitir cambiar el owner
    delete req.body.owner_id;

    await crop.update(req.body);

    res.status(200).json({
      success: true,
      message: 'Cultivo actualizado exitosamente',
      data: crop
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar cultivo
 * @route DELETE /api/crops/:id
 * @access Private
 */
exports.deleteCrop = async (req, res, next) => {
  try {
    const crop = await Crop.findByPk(req.params.id);

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Cultivo no encontrado'
      });
    }

    // Verificar que el usuario sea el owner o admin
    if (req.user.role !== 'admin' && crop.owner_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para eliminar este cultivo'
      });
    }

    await crop.destroy();

    res.status(200).json({
      success: true,
      message: 'Cultivo eliminado exitosamente',
      data: {}
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Obtener estadísticas de cultivos
 * @route GET /api/crops/stats
 * @access Private
 */
exports.getCropStats = async (req, res, next) => {
  try {
    const filters = req.user.role !== 'admin' ? { owner_id: req.user.id } : {};

    const { sequelize } = require('../config/database');
    
    const stats = await Crop.findAll({
      where: filters,
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('area')), 'totalArea']
      ],
      group: ['status'],
      raw: true
    });

    const total = await Crop.count({ where: filters });

    res.status(200).json({
      success: true,
      data: {
        total,
        byStatus: stats.map(s => ({
          _id: s.status,
          count: parseInt(s.count),
          totalArea: parseFloat(s.totalArea) || 0
        }))
      }
    });

  } catch (error) {
    next(error);
  }
};
