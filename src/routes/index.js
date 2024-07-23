const coursesRouter = require('./courses');
const meRouter = require('./me');
const newsRouter = require('./news');
const siteRouter = require('./site');

function route(app) {
    app.use('/courses', coursesRouter);

    app.use('/me', meRouter);

    app.use('/news', newsRouter);

    app.use('/', siteRouter);
}

module.exports = route;
