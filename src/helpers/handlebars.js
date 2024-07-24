const handlebars = require('handlebars');

module.exports = {
    sortable: (field, sort) => {
        const sortType = field === sort.column ? sort.type : 'default'

        const icons = {
            asc: 'bi bi-chevron-up',
            default: 'bi bi-chevron-expand',
            desc: 'bi bi-chevron-down'
        }
        const types = {
            asc: 'desc',
            default: 'desc',
            desc: 'asc',
        }
        
        const icon = icons[sortType];
        const type = types[sort.type];

        const address = handlebars.escapeExpression(`?_sort&column=${field}&type=${type}`);
        const output = `<a href="${address}"><i class="${icon}"></i></a>`;

        return new handlebars.SafeString(output);
    },
    sum: (a, b) => a + b,
};
