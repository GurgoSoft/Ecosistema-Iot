const Crop = require('../models/Crop');

exports.getAll = async (req, res) => {
  try {
    const crops = await Crop.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(crops);
  } catch (error) {
    console.error('Get crops error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getById = async (req, res) => {
  try {
    const crop = await Crop.findByPk(req.params.id);
    
    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }
    
    res.json(crop);
  } catch (error) {
    console.error('Get crop error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.create = async (req, res) => {
  try {
    const crop = await Crop.create(req.body);
    res.status(201).json(crop);
  } catch (error) {
    console.error('Create crop error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.update = async (req, res) => {
  try {
    const crop = await Crop.findByPk(req.params.id);
    
    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }
    
    await crop.update(req.body);
    res.json(crop);
  } catch (error) {
    console.error('Update crop error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.delete = async (req, res) => {
  try {
    const crop = await Crop.findByPk(req.params.id);
    
    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }
    
    await crop.destroy();
    res.json({ message: 'Crop deleted successfully' });
  } catch (error) {
    console.error('Delete crop error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
