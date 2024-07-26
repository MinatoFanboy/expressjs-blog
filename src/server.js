const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const { base64Url } = require('./helpers/base64Url');

const app = express();
const port = 3000;

app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
const jwtSecret = '';

const db = {
    posts: [
        {
            description: 'Description 1',
            id: 1,
            title: 'Title 1',
        },
        {
            description: 'Description 2',
            id: 2,
            title: 'Title 2',
        },
        {
            description: 'Description 3',
            id: 3,
            title: 'Title 3',
        },
    ],
    users: [
        {
            email: 'joedue@gmail.com',
            id: 1,
            name: 'Joe Due',
            password: '123456',
        },
    ],
};

// Session
// const sessions = {};

// [GET] /api/posts
app.get('/api/posts', (req, res) => {
    res.json(db.posts);
});

// [POST], api/auth/login
app.post('/api/auth/login', (req, res) => {
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
});

// [GET], api/auth/me
app.get('/api/auth/me', (req, res) => {
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
});

app.listen(port, () => {
    console.log(`Demo app is running on port ${port}`);
});
