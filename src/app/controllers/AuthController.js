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

    // [GET] /api/auth/getToken
    async getToken(req, res, next) {
        const { email, password } = req.body;
        const user = db.users.find((u) => u.email === email && u.password === password);
        if (user) {
            // const sessionId = Date.now().toString();
            // sessions[sessionId] = { sub: user.id };

            // return res.setHeader('Set-Cookie', `sessionId=${sessionId}; httpOnly; max-age=3600`).json(user);

            // 1. 
            const header = {
                alg: 'HS256',
                typ: 'JWT',
            };

            const payload = {
                sub: user.id,
                exp: Date.now() + 3600000,
            };

            // 2. Mã hóa base64(header & payload)
            const encodeHeader = base64Url(JSON.stringify(header));
            const encodePayload = base64Url(JSON.stringify(payload));

            // 3. Tạo token data <header>.<payload>
            const tokenData = `${encodeHeader}.${encodePayload}`;
            
            // 4. Tạo chữ ký
            const hmac = crypto.createHmac('sha256', jwtSecret);
            const signature = hmac.update(tokenData).digest('base64Url');

            res.json({ token: `${tokenData}.${signature}` });
        }
        
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // [GET] /api/auth/authorize
    async authorize(req, res) {
        // const session = sessions[req.cookies.sessionId];
        // if (!session) {
        //     return res.status(401).json({ message: 'Unauthorized' });
        // }
        // const user = db.users.find((u) => u.id === session.sub);
    
        // return res.json(user);
        const token = req.headers.authorization?.slice(7, );
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const [encodeHeader, encodePayload, signature] = token.split('.');
        const tokenData = `${encodeHeader}.${encodePayload}`;
        
        const hmac = crypto.createHmac('sha256', jwtSecret);
        const tokenSignature = hmac.update(tokenData).digest('base64Url');
        if (tokenSignature !== signature) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const payload = JSON.parse(atob(encodePayload));
        const user = db.users.find((u) => u.id === payload.sub);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (payload.exp < Date.now()) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        
        return res.json(user);
    };
}

module.exports = new AuthController();
