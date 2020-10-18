'use strict';

/**
 * Only needed for development.
 * Populates, ENVs from .env file.
 */
const dotenv = require('dotenv');
if (process.env.NODE_ENV === 'development') {
  const result = dotenv.config();
  if (result.error) console.log(result.error);
}

/**
 * Importing dependencies.
 */
const config = require('config');
const express = require('express');
const initializer = require('./init/init_admin');
const log4js = require('./middlewares/logger');
const banner = require('./models/banner.js');
const pricingRoute = require('./routes/pricing');

const logger = log4js.getLogger('tc_admin');

// Print TC Admin ASCII Art Banner.
console.log(banner);

// Check correct config is loaded
if (process.env.NODE_ENV !== config.get('app.deployment')) {
  logger.warn('Incorrect NODE_ENV set for this deployment. TC Admin will start with default configuration.');
}

// Initialize TC Admin
initializer.init();

// Initialize Express app for REST APIs
const app = express();
app.use('/pricing', pricingRoute);
app.use('/', (req, res) => {
  res.send('Welcome To Thread Connect Admin REST API.');
});

app.use('/*', (req, res) => res.redirect('/'));

const server = app.listen(config.get('app.port'), () => logger.info(`TC Admin REST API Listening on port ${config.get('app.port')}`));

module.exports = server;
