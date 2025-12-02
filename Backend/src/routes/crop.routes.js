const express = require('express');
const router = express.Router();
const cropController = require('../controllers/crop.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);

router.get('/', cropController.getAll);
router.get('/:id', cropController.getById);
router.post('/', cropController.create);
router.put('/:id', cropController.update);
router.delete('/:id', cropController.delete);

module.exports = router;
