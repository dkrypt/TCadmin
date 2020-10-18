'use strict';

const cron = require('cron');
const config = require('config');
const moment = require('moment');
const _ = require('lodash');

const dbService = require('./tc-connector-report-db-service');
const tcUsageService = require('./tc-connector-usage-service');
const tcResourceService = require('./tc-resource-service');
const log4js = require('../middlewares/logger');

const logger = log4js.getLogger('tc_connector_monitor');

const dailyConnectorDbRecord = {};
let queue = [{
  id: 'root',
  parent_id: null,
  parent_index: -1,
  name: 'canvas',
  level: 0,
  connector_count: 0
}];

let allProcessGroups = [{
  id: 'root',
  parent_id: null,
  parent_index: -1,
  name: 'canvas',
  level: 0,
  connector_count: 0
}];

/**
 * Method which fetches the Processor Groups from the TC Instance.
 * Searches for PGs at the configured Depth Level
 */
const fetchProcessGroupsMap = async () => {
  logger.debug('Initiating fetching Process Groups.');
  const reportDepthLevel = config.get('app.connector_monitor_report_level');
  let index = 0;
  while (queue.length != 0) {
    // fetch and remove root process group record
    logger.debug(`Queue before dropping = ${JSON.stringify(queue, null, 2)}`);
    const parent = queue[0];
    queue = _.drop(queue, 1);
    logger.debug(`Queue After dropping = ${JSON.stringify(queue, null, 2)}`);
    logger.debug(`Index is ${index} and Parent Level is ${parent.level} and reportDepthLevel is ${reportDepthLevel}`);
    if (parent.level == reportDepthLevel) {
      break;
    }
    try {
      let children = await tcResourceService.resources.getProcessGroups(parent.id);
      logger.debug(`This is Process Group Response body = ${JSON.stringify(children.body)}`);
      children = children.body;
      if (_.isEmpty(children.processGroups[0]) && parent.level < reportDepthLevel) {
        logger.warn('No Process Groups Exists for this instance.');
        continue;
      }
      if (parent.id == 'root') {
        const canvasID = children.processGroups[0].component.parentGroupId;
        allProcessGroups[0].id = canvasID;
        parent.id = canvasID;
      }
      children.processGroups.forEach((child) => {
        const node = {
          id: child.component.id,
          parent_id: child.component.parentGroupId,
          parent_index: index,
          name: child.component.name,
          level: parent.level + 1,
          connector_count: 0
        };
        queue.push(node);
        allProcessGroups.push(node);
      });
      logger.debug(`allProcessGroups = ${JSON.stringify(allProcessGroups, null, 2)}`);
    } catch (error) {
      throw error.stack;
    }
    index += 1;
  }
  logger.debug('Finished fetching process groups.');
};

/**
 * A method that fetches, processors for all the already recorded Process Groups
 */
const fetchConnectors = async () => {
  logger.debug('Initiating fetch of processors.');
  let deepSearch;
  for (let i = 0; i < allProcessGroups.length; i++) {
    try {
      deepSearch = allProcessGroups[i].level == config.get('app.connector_monitor_report_level');
      const connectorCount = await tcUsageService.getConnctorCount(allProcessGroups[i].id, deepSearch, false);
      allProcessGroups[i].connector_count = connectorCount.connector_count;
      logger.debug(`Fetched processor entity for processor id = ${allProcessGroups[i].id}`);
    } catch (error) {
      throw error;
    }
  }
};

/**
 * Creates a JSON Object to be saved to connector-report file.
 * This JSON Object converts to CSV when queried.
 */
const createCsvRecord = () => {
  logger.info('Intiating storing the connector report.');
  const levelMap = ['ROOT', 'Business', 'Project', 'Sub Project'];
  const projectPgArray = _.filter(dailyConnectorDbRecord, (value) => value.level == config.get('app.connector_monitor_report_level'));
  _.forEach(projectPgArray, (projectPg, i) => {
    getProjectFamily(projectPg)
        .then((row) => {
          const csvRow = {
            Date: `${moment().format('DD MMMM YYYY')}`
          };
          _.forEach(_.reverse(row), (value) => {
            if (value.level == 0) {
              csvRow['Root Connector'] = value.connector_count;
            } else {
              csvRow[levelMap[value.level]] = value.name;
              csvRow[`${levelMap[value.level]} Connector Count`] = value.connector_count;
            }
          });
          logger.debug(`This is CSV Row = ${JSON.stringify(csvRow, null, 2)}`);
          insertRecordIntoDb(csvRow);
        });
  });
  logger.debug('Records successfully added to CSV file DB.');
};

/**
 * A method to recursively get the children processors for a given upper level Process Group.
 * @param {Object} child the child object of a given Process Group.
 * @param {Array} row an Array to represent the CSV row, which contains the child object.
 * @return {Array} An array containing all the processors for a given process group.
 */
const getProjectFamily = (child, row) => new Promise((resolve, reject) => {
  row = typeof row !== 'undefined' ? row : [];
  row.push(child);
  if (child.level != 0) {
    const parent = _.get(dailyConnectorDbRecord, child.parent_id);
    resolve(getProjectFamily(parent, row));
  }
  resolve(row);
});

/**
 * Inserts the Array record in lowDB with a timestamp.
 * @param {Array} record Record to be inserted in lowDB.
 */
function insertRecordIntoDb(record) {
  const monthOfYear = moment().format('MMMM').toLowerCase();
  const today = moment().format('DD-MMMM-YYYY');
  const db = dbService.getDB();
  // Check if month entry exists
  if (!db.has(`month.${monthOfYear}`).value()) {
    logger.info('Month entry does not exist. Creating new month entry.');
    const currentMonth = {};
    currentMonth[moment().format('MMMM').toLowerCase()] = {};
    db.get('month').assign(currentMonth).write();
  }
  // Check if daily entry exists
  if (!db.has(`month.${monthOfYear}.${today}`).value()) {
    logger.info('Daily Entry does not exists. Creating new daily entry.');
    db.get(`month.${monthOfYear}`).set(today, []).write();
  }
  db.get(`month.${monthOfYear}.${today}`).push(record).write();
};

/**
 * Method which run at given CRON Pattern.
 * Fetching Processor Groups
 * Fetching Processors and writing them to CSV File DB
 */
const startMonitor = async () => {
  logger.info('Starting Connector Monitor.');
  const db = dbService.getDB();
  try {
    await fetchProcessGroupsMap();
    await fetchConnectors();
    _.forEach(allProcessGroups, (pg) => dailyConnectorDbRecord[`${pg.id}`] = pg);
    logger.debug('Daily Connector DB Record = '+JSON.stringify(dailyConnectorDbRecord, null, 2));
    createCsvRecord();
    logger.debug('Checking and deleting old month entries');
    const expiredMonth = moment().subtract(3, 'months').format('MMMM').toLowerCase();
    if (db.get('month').keys().value().length > 3 && db.has(`month.${expiredMonth}`)) {
      logger.debug(`Deleting Records for expired month ${expiredMonth}`);
      db.unset(`month.${expiredMonth}`).write();
    }
  } catch (error) {
    logger.error(new Error(error).stack);
  }
};

/**
 * Method to start the CRON Job, at given cron pattern.
 * @param {string} cronPattern Cron pattern to start the job at.
 */
const startCronJob = (cronPattern) => {
  const job = new cron.CronJob(cronPattern, startMonitor);
  job.start();
  logger.info(`Connector Monitor Set to Run as Cron Job @ ${cronPattern}. Job running = ${job.running}`);
};

const fetchAllMonths = () => {
  const db = dbService.getDB();
  return db.get('month').value();
};

const fetchPgForMonth = (month) => {
  const db = dbService.getDB();
  const pgForMonth = db.get(`month.${month}`).value();
  return pgForMonth === undefined ? '' : pgForMonth;
};

module.exports.startCronJob = startCronJob;
module.exports.fetchPgForMonth = fetchPgForMonth;
module.exports.fetchAllMonths = fetchAllMonths;
