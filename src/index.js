const path = require('path');
const express = require('express');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

const route = require('./routes');

const db = require('./config/db');

const sortMiddleWares = require('./app/middlewares/SortMiddlewares');

// Connect to DB
db.connect();

app.use(express.static(path.join(__dirname, 'public')));

// Http Logger
app.use(morgan('combined'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(sortMiddleWares);

// Template Engine
app.set('view engine', 'hbs');

app.engine(
    'hbs',
    handlebars.engine({
        extname: '.hbs',
        helpers: {
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

                return `<a href="?_sort&column=${field}&type=${type}"><i class="${icon}"></i></a>`
            },
            sum: (a, b) => a + b,
        }
    }),
);

app.set('views', path.join(__dirname, 'resources', 'views'));

// Routes init
route(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
