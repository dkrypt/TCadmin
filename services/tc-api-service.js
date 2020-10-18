'use strict';

const config = require('config');
const got = require('got');
const _ = require('lodash');
const logger = require('../middlewares/logger').getLogger('tc_admin');

const authenticate = require('./tc-authentication-service');


/**
 * A generic method to call TC (NiFi) APIs, with configured Authentication scheme.
 * @param {String} contextPath API route
 * @param {Object} options Request options
 */
const fetchApi = async (contextPath, options) => {
  let response;
  const defaultOptions = {
    prefixUrl: config.get('tc.api_url'),
    timeout: 90000,
    retry: 1,
    followRedirect: true
  };
  options = await authenticate(options);
  _.assign(defaultOptions, options);
  try {
    response = await got(contextPath, defaultOptions);
    return response;
  } catch (error) {
    logger.error(error.response);
    logger.debug(`Error is ${error}`);
  }
};

module.exports.callApi = fetchApi;
