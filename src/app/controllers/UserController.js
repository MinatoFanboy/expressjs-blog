const User = require('../models/User');

class UserController {
    // [GET] /api/user/list
    async index (req, res) {
        const users = await User.find({}).sort({ createdAt: -1 });

        res.json({ data: users });
    }

    // [POST] /api/user/store
    async store(req, res) {
        try {
            const user = new User({
                email: req.body.email,
                name: req.body.name,
                password: req.body.password,
            });

            const newUser = await user.save();

            res.status(201).json({ data: newUser });
        } catch (error) {
            console.log(error);

            res.status(400).json({ code: 400, message: 'Bad request.' });
        }
    }

    // [GET] /api/user/:id
    async show(req, res) {
        const user = await User.findById(req.params.id).exec();

        res.json({ data: user });
    }

    // [PUT] /api/user/:id
    async update(req, res) {
        await User.findOneAndUpdate({
            _id: req.params.id
        }, {
            email: req.body.email,
            name: req.body.name,
            password: req.body.password,
        });
        const user = await User.findById(req.params.id).exec();

        res.json({ data: user });
    }

    // [PUT] /api/user/:id
    async destroy(req, res) {
        const user = await User.findById(req.params.id).exec();
        if (!user) {
            res.status(404).json({
                code: 404,
                message: 'Resource not found.'
            });
        }

        await User.findByIdAndDelete(req.params.id);

        res.status(204).json('OK');
    }
}

module.exports = new UserController();
