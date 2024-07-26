const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const jwtConfig = require('../../config/jwt');
const User = require('../models/User');

class AuthController {
    // [POST] /api/auth/login
    async login(req, res, next) {
        const user = await User.findOne({ email: req.body.email, password: req.body.password });
        if (user) {
            const token = jwt.sign({ sub: user.id }, jwtConfig.secret, {
                expiresIn: jwtConfig.expiresIn,
            });

            res.json({ data: { token } });
        } else {
            res.status(401).json({ code: 401, message: 'Authorized' });
        }
    }

    // [POST] /api/auth/register
    async register(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                code: 422,
                errors: errors.array(),
            });
        }

        try {
            const user = new User({
                email: req.body.email,
                name: req.body.name,
                password: req.body.password,
            });

            const newUser = await user.save();
            return res.status(201).json({ data: newUser });
        } catch (error) {
            return res.status(400).json({ code: 400, message: 'Bad request' });
        }
    }

    // [GET] /current-user
    async currentUser(req, res) {
        res.json({ data: req.user });
    }
}

module.exports = new AuthController();
