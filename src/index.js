const path = require('path')
const express = require('express')
const morgan = require('morgan')
const handlebars = require('express-handlebars')
const app = express()
const port = 3000

const route = require('./routes')

app.use(express.static(path.join(__dirname, 'public')))

// Http Logger
app.use(morgan('combined'))

// Template Engine
app.set('view engine', 'hbs');

app.engine('hbs', handlebars.engine({
  extname: '.hbs'
}));

app.set('views', path.join(__dirname, 'resources/views'))

// Routes init
route(app)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})