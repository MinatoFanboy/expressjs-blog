const express = require('express');
const router = express.Router();

const userController = require('../app/controllers/UserController');

router.get('/list', userController.index);

router.post('/save', userController.store);

router.get('/:id', userController.show);

router.put('/:id', userController.update);

router.delete('/:id', userController.destroy)

module.exports = router;
