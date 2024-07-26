const authRouter = require('./auth');
const coursesRouter = require('./courses');
const meRouter = require('./me');
const newsRouter = require('./news');
const siteRouter = require('./site');
const userRouter = require('./user');

function route(app) {
    app.use('/courses', coursesRouter);

    app.use('/me', meRouter);

    app.use('/news', newsRouter);

    app.use('/', siteRouter);

    // API
    app.use('/api/auth', authRouter);

    app.use('/api/user', userRouter);
}

module.exports = route;
