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

const sortMiddleWares = require('./app/middlewares/sortMiddlewares');

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
        helpers: require('./helpers/handlebars')
    }),
);

app.set('views', path.join(__dirname, 'resources', 'views'));

// Routes init
route(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
