'use strict';

const config = require('config');
const _ = require('lodash');
const path = require('path');
const fs = require('fs');

const jwtService = require('./tc-jwt-service');
const log4js = require('../middlewares/logger');

const logger = log4js.getLogger('tc_admin');

/**
 * Attaches the JWT Header to the given configuration.
 * @param {Object} options GOT Configuration Object.
 * @return {Object} the configured GOT configuration object.
 */
const setAccessToken = async (options) => {
  const token = await jwtService.getJWT();
  _.assign(options, {headers: {Authorization: `Bearer ${token}`}});
  return options;
};

/**
 * Attaches the SSL info to the given configuration.
 * @param {Object} options GOT Configuration Object
 * @return {Object} the configured GOT configuration object.
 */
const setSSL = (options) => {
  const https = {
    https: {
      certificateAuthority: fs.readFileSync(path.join(config.get('app.certs_dir'), config.get('app.ca_filename'))),
      key: fs.readFileSync(path.join(config.get('app.certs_dir'), config.get('app.pvt_key_filename'))),
      certificate: fs.readFileSync(path.join(config.get('app.certs_dir'), config.get('app.pub_cert_filename')))
    }
  };
  _.assign(options, https);
  return options;
};

/**
 * A method which attaches the appropriate Authentication config to the provided GOT config.
 * @param {Object} options GOT configuration object. The Authentication will be added to the same config object.
 * @return {Object} the configured GOT configuration object.
 */
const authenticate = async (options) => {
  if ('oidc' === config.get('tc.id_provider').toLowerCase()) {
    return new Promise((resolve) => {
      resolve(setSSL(options));
    });
  } else if ('file-identity' === config.get('tc.id_provider').toLowerCase()) {
    return await setAccessToken(options);
  } else {
    logger.error('tc.id_provider is either not set in config, or is set to invalid value. Requests will not be authenticated.');
    return options;
  }
};

module.exports = authenticate;
