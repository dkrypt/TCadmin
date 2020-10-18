'use strict';

const config = require('config');
const fs = require('fs');
const {join} = require('path');
const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const logger = require('../middlewares/logger').getLogger('tc_admin');

const connectorReportDirectory = config.get('app.connector_report_directory');
const connectorReportFile = 'connector-report.json';

/**
 * Method to initialize and configure the given file DB.
 * Creates the directories if not found.
 */
const initializeDB = () => {
  if (!fs.existsSync(connectorReportDirectory)) {
    logger.info('Connector Report Directory does not exist. One will be created.');
    fs.mkdirSync(connectorReportDirectory, {recursive: true});
    logger.debug('Connector Report Directory created.');
    if (!fs.existsSync(join(connectorReportDirectory, connectorReportFile))) {
      logger.info('Connector Report File does not exist. One will be created.');
      fs.writeFileSync(join(connectorReportDirectory, connectorReportFile), '', {encoding: 'utf-8'});
      logger.debug('Connector Report File created.');
    }
  } else {
    logger.info(`Connector Report Directory and File exists @ ${join(connectorReportDirectory, connectorReportFile)}`);
  }
};

/**
 * Returns the current instance of the file DB.
 * @return {Lowdb} instance of Lowdb
 */
const getDB = () => {
  const adapter = new FileSync(join(connectorReportDirectory, connectorReportFile));
  const db = lowdb(adapter);
  db.defaults({month: {}}).write();
  return db;
};
module.exports.initializeDB = initializeDB;
module.exports.getDB = getDB;
