const express = require('express');
const morgan = require('morgan');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('../api/routes/v1');
const { logs } = require('./variables');
const error = require('../api/middlewares/error');

const app = express();

// request logging, dev: console | production: file
app.use(morgan(logs));

// parse body params and attaches them to req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// gzip compression
app.use(compress());

// secure apps by setting vairous HTTP headers
app.use(helmet());

// enable CORS
app.use(cors());

// mount routes
app.use('/api/v1', routes);

// if error not an instanceOf APIError, convert it.
app.use(error.converter);

// catch 404 and forward to error handler
app.use(error.notFound);

// error handler, send stacktace only in development
app.use(error.handler);

module.exports = app;
