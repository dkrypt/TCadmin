'use strict';

const express = require('express');
const {parse} = require('json2csv');

const connectorMonitorService = require('../services/tc-connector-monitor-service');
const _ = require('lodash');

const router = express.Router();

/**
 * A method to get the JSON representation of Monthly snapshot of connectors.
 * @param {String} month Month name
 * @return {Array} Array containing the monthly snapshots.
 */
const getJsonForMonth = (month) => {
  let inputJson = [];
  const monthSnapshot = connectorMonitorService.fetchPgForMonth(month);
  if (monthSnapshot === '') {
    return '';
  }
  _.forEach(monthSnapshot, (dailyRecord) => inputJson = _.concat(inputJson, dailyRecord));
  return inputJson;
};

/**
 * A method to get the JSON representation of all the snapshots of connectors.
 * @return {Array} Array containing all the snapshots
 */
const getJsonForAllMonths = () => {
  const months = connectorMonitorService.fetchAllMonths();
  let allEntries = [];
  _.forEach(months, (month) => _.forEach(month, (dailyRecord) => {
    allEntries = _.concat(allEntries, dailyRecord);
  }));
  if (_.isEmpty(allEntries)) return '';
  return allEntries;
};

const createCsv = (data) => {
  const csvFields = _.keys(data[0]); // Keys of daily record.
  const csvResponse = parse(data, {csvFields});
  return csvResponse;
};

router.get('/connector-report/all', async (req, res) => {
  const jsonResponseAllMonth = await getJsonForAllMonths();
  // console.log(JSON.stringify(jsonResponseAllMonth, null, 2));
  if (jsonResponseAllMonth === '') {
    res.status(404).send(`No records found. Check your request or check application logs.`);
  } else {
    res.set('Content-Type', 'application/csv');
    res.status(200).send(createCsv(jsonResponseAllMonth));
  }
});

router.get('/connector-report/:month', (req, res) => {
  const month = req.params.month.toLowerCase();
  const jsonResponse = getJsonForMonth(month);
  if (jsonResponse === '') {
    res.status(404).send(`No records found for month of ${month}`);
  } else {
    res.set('Content-Type', 'application/csv');
    res.status(200).send(createCsv(jsonResponse));
  }
});

module.exports = router;
