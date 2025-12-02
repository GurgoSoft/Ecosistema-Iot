const { Op } = require('sequelize');
const Product = require('../models/Product');
const Crop = require('../models/Crop');
const Employee = require('../models/Employee');
const Task = require('../models/Task');
const Inventory = require('../models/Inventory');

exports.getStats = async (req, res) => {
  try {
    // Total de productos
    const totalProducts = await Product.count();
    
    // Productos con stock bajo
    const lowStockProducts = await Product.count({
      where: { status: 'low_stock' }
    });
    
    // Total de cultivos activos
    const activeCrops = await Crop.count({
      where: {
        status: {
          [Op.in]: ['planted', 'growing']
        }
      }
    });
    
    // Total de empleados activos
    const activeEmployees = await Employee.count({
      where: { status: 'active' }
    });
    
    // Tareas pendientes
    const pendingTasks = await Task.count({
      where: {
        status: {
          [Op.in]: ['pending', 'in_progress']
        }
      }
    });
    
    // Tareas completadas este mes
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const completedTasksThisMonth = await Task.count({
      where: {
        status: 'completed',
        completedDate: {
          [Op.gte]: startOfMonth
        }
      }
    });
    
    // Items de inventario con stock bajo
    const lowStockInventory = await Inventory.count({
      where: {
        quantity: {
          [Op.lte]: sequelize.col('minStock')
        }
      }
    });
    
    // Cultivos por estado
    const cropsByStatus = await Crop.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status']
    });
    
    // Tareas por prioridad
    const tasksByPriority = await Task.findAll({
      attributes: [
        'priority',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['priority'],
      where: {
        status: {
          [Op.ne]: 'completed'
        }
      }
    });

    res.json({
      totalProducts,
      lowStockProducts,
      activeCrops,
      activeEmployees,
      pendingTasks,
      completedTasksThisMonth,
      lowStockInventory,
      cropsByStatus,
      tasksByPriority
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
