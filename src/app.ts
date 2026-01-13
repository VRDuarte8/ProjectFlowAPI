require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

require('./config/db');

const router = require('./routes/Router');
app.use(router);

module.exports = app;
