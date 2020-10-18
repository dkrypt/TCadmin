'use strict';

const got = require('got');
const config = require('config');

const log4js = require('../middlewares/logger');
const cache = require('../middlewares/cache-service');

const logger = log4js.getLogger('tc_admin');

/**
 * Checks if the given token is Expired.
 * @param {String} token JSON Web Token
 * @return {Boolean} true if JWT is Expired.
 */
const isExpired = (token) => {
  const tokenPayload = token.split('.')[1];
  const decodedPayload = JSON.parse(Buffer.from(tokenPayload, 'base64').toString('utf-8'));
  const expirationTime = decodedPayload.exp;
  const currentTime = Math.floor(new Date().valueOf()/1000);
  return (currentTime > expirationTime);
};

/**
 * Method to fetch a fresh TC JWT, querying TC APIs.
 */
const fetchToken = async () => {
  const tokenOptions = {
    method: 'post',
    prefixUrl: config.get('tc.api_url'),
    timeout: 90000,
    retry: 1,
    followRedirect: true,
    form: {
      username: config.get('app.admin_username'),
      password: config.get('app.admin_password')
    }
  };
  const res = await got('access/token', tokenOptions);
  if (Math.floor(res.statusCode/100) === 2) {
    return res.body.trim();
  } else {
    logger.error(`Unable to fetch JWT. HTTP Status Code = ${res.statusCode}, HTTP Status Message = ${res.statusCode}`);
  }
};

/**
 * Method to return the JWT, wither from Cache or by requesting new one.
 */
const getJWT = async () => {
  if (cache.get('nifi-token') === undefined || cache.get('nifi-token') === '' || isExpired(cache.get('nifi-token'))) {
    const token = await fetchToken();
    logger.info('Setting Cache.');
    cache.set('nifi-token', token);
  }
  const jwt = cache.get('nifi-token');
  return jwt;
};

const cacheJWT = async () => {
  await getJWT();
};

module.exports.getJWT = getJWT;
module.exports.cacheJWT = cacheJWT;
