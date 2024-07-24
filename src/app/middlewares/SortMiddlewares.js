module.exports = function SortMiddlewares(req, res, next) {
    res.locals._sort = {
        enable: false,
        type: 'default',
    };

    if (req.query.hasOwnProperty('_sort')) {
        Object.assign(res.locals._sort, {
            column: req.query.column,
            enabled: true,
            type: req.query.type,
        })
    }

    next();
};
