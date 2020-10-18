'use strict';

const _ = require('lodash');

const connectors = require('../models/metered-connectors');
const tcResourcesService = require('./tc-resource-service');
const log4js = require('../middlewares/logger');

// get the reporting log appender
const logger = log4js.getLogger('reporting');

/**
 * UsageService object for obtaining reporting metrics from a running NiFi instance.
 */
const usageService = {};

/**
 * Retrieves a reporting object that contains the reportable number of connectors for a
 * running NiFi instance and optionally the list of connectors that the report is derived from.
 * @param {String} id ID of the process group
 * @param {boolean} deepSearch Include processors from PGs inside Process Groups.
 * @param {boolean} includeItems Whether to include the processor metadata
 *  Specify whether or not to include the list of connectors that are included in the count.
 *
 * @return {ReportingObject}
 */
usageService.getConnctorCount = async (id, deepSearch, includeItems = true) => {
  console.log(`Inside getConnctorCount with Params = ${id}, ${deepSearch} and ${includeItems}`);
  let processors = await tcResourcesService.resources.getProcessors(id, deepSearch);
  processors = processors.body;
  // console.info(`Fetched Processors = ${JSON.stringify(processors)}`);
  const filtered = usageService.filterItemsByStatus(processors.processors, 'RUNNING');
  return usageService.getReportList(filtered, includeItems);
};

/**
   * Retrieves the filtered list of connectors based on the status provided.
   *
   * @param {list} items The list of items to be filtered (processors or connectors).
   * @param {String} status The status to filter by (defaults to RUNNING status).
   *
   * @return {list} The filtered list.
   */
usageService.filterItemsByStatus = function(items, status = 'RUNNING') {
  return _.filter(items, (i) => i.component && i.component.state === status);
};

/**
   * Obtains a reporing list object that will be used to report current
   * usage of a running NiFi instance.
   *
   * @param {list} processors
   *   The list of processors (connectors) to obtain reporting information on.
   * @param {boolean} includeItems
   *  Flag to specify whether or not to also include the list of connectors that
   *  the report object was determined by.
   *
   * @return {ReportObject}
   *  A ReportObject that contains the connector_count and optionally the connector_list.
   */
usageService.getReportList = function(processors, includeItems = true) {
  const connectorList = [];
  const connectorSet = new Set();
  _.each(processors, (i) => {
    const uniqueKey = connectors.getUniqueKey(i);
    if (uniqueKey) {
      connectorList.push({
        id: i.id,
        type: i.status.aggregateSnapshot.type
      });
      connectorSet.add(uniqueKey);
    }
  });
  return {
    connector_count: connectorSet.size,
    connector_list: includeItems ? connectorList : []
  };
};

module.exports = usageService;
