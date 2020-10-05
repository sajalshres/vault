const express = require('express');
const morgan = require('morgan');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const { logs } = require('./variables');

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

module.exports = app;
