'use strict';

const got = require('got');
const config = require('config');
const _ = require('lodash');

const tcUsageService = require('./tc-connector-usage-service');
const logger = require('../middlewares/logger').getLogger('nurego_reporting');

/**
 * Service object for interacting with a Nurego instance REST API.
 */
const reportingService = {};
reportingService.intervalId = null;

/**
 * A common method to configure and make HTTP calls to Nurego Endpoint.
 * @param {String} path context path for Nurego Endpoint
 * @param {Object} options GOT coonfiguration object.
 */
const nuregoAPIService = async (path, options) => {
  const defaultOptions = {
    prefixUrl: config.get('app.nurego_endpoint'),
    responseType: 'json',
    followRedirect: true
  };
  _.assign(options, defaultOptions);
  const response = await got(path, options);
  return response;
};

/**
 * Retrieves an authorization token from a Nurego instance.
 *
 * @return {Promise}
 */
reportingService.getAuthToken = async () => {
  const options = {
    method: 'POST',
    form: {
      username: config.get('app.nurego_username'),
      password: config.get('app.nurego_password'),
      instance_id: config.get('app.nurego_instance_id')
    }
  };
  const token = await nuregoAPIService('auth/token', options);
  return token.body.access_token || '';
};

/**
 * Post a Usage Event to Nurego by subscription
 *
 * @param {string} token JWT
 * @param {string} featureId featureID
 * @param {string} amount amount
 * @return {Promise}
 */
reportingService.postUsage = async (token, featureId, amount) => {
  const subsId = `${process.env.TC_SUBS_ID}`;
  const data = [];
  const usage = {
    subscription_id: subsId,
    provider: 'cloud-foundry',
    feature_id: featureId,
    amount: parseInt(amount, 10),
    id: '1'
  };
  data.push(usage);
  const bodyObj = {
    data,
    object: 'list',
    count: 1
  };

  const options = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: bodyObj
  };
  logger.info(`Reporting the usage to Nurego. Usage Data : ${JSON.stringify(bodyObj, null, 4)}`);
  let response = await nuregoAPIService('usages', options);
  response = response.body;
  // Only for development mode
  if (response) {
    logger.info(`Response from Nurego while posting usage: ${JSON.stringify(response)}`);
    logger.info(JSON.stringify(response));
  }
  if (response && response.count > 0) {
    logger.error('Nurego rejected usage data with the following error:');
    logger.error(JSON.stringify(response));
    throw new Error('Reporting usage to Nurego failed.');
  }
};

/**
 * Initialize the Reporting interval job
 *
 * @param {Number} repInterval
 */
reportingService.initReporting = async (repInterval) => {
  // protect against starting another timer.
  if (reportingService.intervalId) {
    return;
  }
  // Require interval to be provided
  if (!repInterval) {
    return;
  }
  const reportingDuration = config.get('app.nurego_reporting_duration');
  const reportingInterval = repInterval || reportingDuration;
  try {
    reportingService.intervalId = setInterval(async () => {
      const data = await tcUsageService.getConnctorCount('root', true, false);
      const nuregoToken = await reportingService.getAuthToken();
      try {
        await reportingService.postUsage(nuregoToken, 'num_connector', data.connector_count);
      } catch (error) {
        logger.error('Reporting Failure: Failure occured while attempting to report usage for '+
              `Subscription ${process.env.ZONE}. Service returned the following error: ${err}`);
        logger.error(new Error().stack);
      }
    }, reportingInterval);
  } catch (err) {
    logger.error(`Failed to set Reporting Timer Interval due to: ${err}`);
    logger.error(new Error().stack);
  }
};

/**
 * Stop the automatic reporting set by a previous call to initReporting().
 */
reportingService.stopReporting = () => {
  if (reportingService.intervalId) {
    logger.info('Stopping Reporting Service');

    clearInterval(reportingService.intervalId);
    reportingService.intervalId = null;
  }
};

module.exports = reportingService;
