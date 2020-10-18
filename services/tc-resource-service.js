'use strict';

const tcApiService = require('./tc-api-service');

/**
 * Gets the Processors from the given Process Group, querying the TC APIs.
 * @param {String} id ID of the process group
 * @param {Boolean} deepSearch whether to get processors from the Process Groups.
 */
const getProcessors = async (id = 'root', deepSearch = true) => {
  const path = `process-groups/${id}/processors${deepSearch ? '?includeDescendantGroups=true' : ''}`;
  const options = {
    method: 'get',
    headers: {
      'content-type': 'application/json'
    },
    responseType: 'json'
  };
  const processorEntity = await tcApiService.callApi(path, options);
  // console.log(JSON.stringify(processorEntity.body, null, 2));
  return processorEntity;
};

/**
 * Gets the Process Groups from the given Process Group, querying the TC APIs.
 * @param {String} id ID of the Processs Group.
 */
const getProcessGroups = async (id) => {
  const path = `process-groups/${id}/process-groups`;
  const options = {
    method: 'get',
    headers: {
      'content-type': 'application/json'
    },
    responseType: 'json'
  };
  const processGroupsEntity = await tcApiService.callApi(path, options);
  return processGroupsEntity;
};

module.exports.resources = {getProcessors, getProcessGroups};
