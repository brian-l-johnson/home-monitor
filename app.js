var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var climateRouter = require('./routes/climate');

var climateMonitor = require('./queue/ClimateMonitor');
climateMonitor.startMonitor();

var db = require('./db');

var app = express();

require('dotenv').config()

const swaggerDefinition = {
    info: {
        title: 'Home Monitor',
        version: '1.0.0',
        desription: 'Home monitoring data collector'
    }
}

const options = {
    swaggerDefinition,
    apis: ['./routes/*.js']
}


app.use(express.json());
const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/climate', climateRouter);
//app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
