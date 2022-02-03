var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

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

app.use(function(req, res, next) {
    let origin = req.get('origin');
    let allowedOrigins = process.env.ALLOWED_CORS_ORIGINS.split(",");
    if(allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH");
        res.header("Access-Control-Allow-Credentials", "true");
    }
    next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/climate', climateRouter);

module.exports = app;
