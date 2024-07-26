const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const authController = require('../app/controllers/AuthController');
const authRequired = require('../helpers/authRequired');

router.post('/login', authController.login);

router.post(
    '/register',
    body('name').isLength({ min: 2 }),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    authController.register
);

router.get('/current-user', authRequired, authController.currentUser);

module.exports = router;
