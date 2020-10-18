'use strict';

const config = require('config');
const fs = require('fs');

const log4js = require('../middlewares/logger');
const {initializeDB} = require('../services/tc-connector-report-db-service');
const connectoMonitorService = require('../services/tc-connector-monitor-service');
const nuregoReportingService = require('../services/tc-nurego-reporting-service');

const logger = log4js.getLogger('tc_admin');

/**
 * Method to configure the Authentication Mechanism for TC Admin,
 * based on configured ID Provider in TC.
 * Checks provided configuration against the required parameters and files.
 */
const configureIDProvider = () => {
  if (config.get('tc.id_provider') === 'oidc') {
    logger.info('Thread Connect is configured to use OIDC ID Provider. TC Admin will use, TLS(SSL) as preferred authentication mechanism.');
    const certsDirectory = config.get('app.certs_dir');

    // If certificate Directory exists, check for certificates
    if (fs.existsSync(certsDirectory)) {
      const files = fs.readdirSync(certsDirectory, {encoding: 'utf-8', withFileTypes: true});
      let caExists = false;
      let pvtKeyExists = false;
      let pubCertExists = false;

      files.forEach((file) => {
        if (config.get('app.ca_filename') === file.name) {
          caExists = true;
          logger.debug(`CA Root Certificate found @ ${certsDirectory}/${file.name}`);
        }
        if (config.get('app.pvt_key_filename') === file.name) {
          pvtKeyExists = true;
          logger.debug(`Private Key found @ ${certsDirectory}/${file.name}`);
        }
        if (config.get('app.pub_cert_filename') === file.name) {
          pubCertExists = true;
          logger.debug(`Certificate found @ ${certsDirectory}/${file.name}`);
        }
      });
      if (!(caExists && pvtKeyExists && pubCertExists)) {
        logger.error('Required certificates are not present. TC Admin won\'t be able to communicate properly with TC.');
      }
    }
  } else if (config.get('tc.id_provider') === 'file-identity') {
    logger.info('TC is configured to use File Identity Provider. TC Admin will use TC JWT for authentication');
    if (config.get('app.admin_username') !== '' && config.get('app.admin_password') !== '') {
      logger.info('Admin Username and Password are set. Ensure, a user with same credentials, exists in TC');
    } else {
      logger.error('Admin Username and/or Password are/is not set. HTTP Communication with TC will not take place.');
    }
  }
};

/**
 * Configures Connector Monitor CRON Job and Nurego Reporting.
 * Checks for provided configuration and required directories.
 */
const configureComponents = () => {
  logger.info('Initializing Connector Report Monitor before starting.');
  if (config.get('app.connector_monitor_enabled') === 'true') {
    logger.info('CONNECTOR_MONITOR_ENABLED is set to true. Initializing Connector Monitor.');
    initializeDB();
    const cronPtrn = config.get('app.connector_monitor_cron');
    if (cronPtrn === undefined || cronPtrn === '') {
      logger.error(`No value set for app.connector_monitor_cron. Connector Monitor will start with default CRON Time.`);
      connectoMonitorService.startCronJob('0 4 * * *');
    } else {
      connectoMonitorService.startCronJob(cronPtrn);
    }
  } else {
    logger.info('Connector Monitor is not enabled. Please set CONNECTOR_MONITOR_ENABLED env to start it.');
  }

  logger.info('Initializing Nurego Reporting before starting');
  if (config.get('app.nurego_reporting_enabled') === 'true') {
    logger.info('NUREGO_REPORTING_ENABLED is set to true. Initializing Nurego Reporting.');
    const reportingInterval = config.get('app.nurego_reporting_duration');
    if (reportingInterval === undefined || reportingInterval === '') {
      logger.error('No value set for app.nurego_reporting_duration. Nurego reporting will start with default reporting interval.');
      nuregoReportingService.initReporting(36000);
    } else {
      nuregoReportingService.initReporting(reportingInterval);
    }
  } else {
    logger.info('Nurego Reporting is not enabled. Please set NUREGO_REPORTING_ENABLED env to start it.');
  }
};

/**
 * Initializer Method. Initializes the whole TC Admin app.
 */
const init = () => {
  logger.info('Initializing Thread Connect Admin Application.');
  configureIDProvider();
  configureComponents();
};

module.exports.init = init;
