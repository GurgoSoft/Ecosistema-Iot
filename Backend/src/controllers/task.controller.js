const Task = require('../models/Task');
const Employee = require('../models/Employee');
const Crop = require('../models/Crop');

exports.getAll = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      include: [
        { model: Employee, as: 'employee', attributes: ['id', 'name', 'position'] },
        { model: Crop, as: 'crop', attributes: ['id', 'name', 'type'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getById = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: [
        { model: Employee, as: 'employee' },
        { model: Crop, as: 'crop' }
      ]
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.create = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    const taskWithRelations = await Task.findByPk(task.id, {
      include: [
        { model: Employee, as: 'employee' },
        { model: Crop, as: 'crop' }
      ]
    });
    res.status(201).json(taskWithRelations);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.update = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    await task.update(req.body);
    const updatedTask = await Task.findByPk(task.id, {
      include: [
        { model: Employee, as: 'employee' },
        { model: Crop, as: 'crop' }
      ]
    });
    res.json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.delete = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    await task.destroy();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
