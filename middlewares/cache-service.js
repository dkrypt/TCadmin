'use strict';
/**
 * This implements a Least Recently Used Cache, to cache JWT on primary basis.
 * However this cache can be used to cache anything, in memory.
 *
 * Maximum size of the cache is 100, as configured in options below.
 * Maximum Age of the cached entry is 2 hours (2H * 60m * 60s * 1000ms).
 */
const LRU = require('lru-cache');

const options = {
  max: 100,
  maxAge: 1000 * 60 * 60 * 2
};

const cache = new LRU(options);

module.exports = cache;
