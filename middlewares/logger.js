'use strict';

const log4js = require('log4js');
const config = require('config');
const path = require('path');

// Define and populate constants for Logger Configuration
const logPattern = '%x{subscriber_id} [%d{yyyy-mm-dd hh:mm:ss,SSS}] %p [%c] - %m%n';
const logFilename = `${path.join(config.get('logging.log_directory'), config.get('logging.filename'))}`;
const logMaxLogSize = config.get('logging.max_size');
const logBackups = config.get('logging.max_backup_files');
const subId = config.get('logging.subscription_id');
const logLevel = config.get('logging.level');

log4js.configure({
  appenders: {
    tc_admin: {
      type: 'file',
      filename: logFilename,
      maxLogSize: logMaxLogSize,
      backups: logBackups,
      compress: true,
      keepFileExt: true,
      layout: {
        type: 'pattern',
        pattern: logPattern,
        tokens: {
          subscriber_id: subId
        }
      }
    },
    nurego_reporting: {
      type: 'file',
      filename: logFilename,
      maxLogSize: logMaxLogSize,
      backups: logBackups,
      compress: true,
      keepFileExt: true,
      layout: {
        type: 'pattern',
        pattern: '%x{subscriber_id} [%d{yyyy-mm-dd hh:mm:ss,SSS}] %p [%c] - %m%n',
        tokens: {
          subscriber_id: subId
        }
      }
    },
    connector_metering: {
      type: 'file',
      filename: logFilename,
      maxLogSize: logMaxLogSize,
      backups: logBackups,
      compress: true,
      keepFileExt: true,
      layout: {
        type: 'pattern',
        pattern: '%x{subscriber_id} [%d{yyyy-mm-dd hh:mm:ss,SSS}] %p [%c] - %m%n',
        tokens: {
          subscriber_id: subId
        }
      }
    },
    access: {
      type: 'file',
      filename: './logs/access.log',
      maxLogSize: 104857600,
      backups: 3,
      compress: true,
      keepFileExt: true,
      layout: {
        type: 'pattern',
        pattern: '%x{subscriber_id} [%d{yyyy-mm-dd hh:mm:ss,SSS}] %p [%c] - %m%n',
        tokens: {
          subscriber_id: subId
        }
      }
    }
  },
  categories: {
    default: {
      appenders: ['tc_admin'],
      level: logLevel
    },
    nurego_reporting: {
      appenders: ['nurego_reporting'],
      level: logLevel
    },
    connector_metering: {
      appenders: ['connector_metering'],
      level: logLevel
    },
    http: {
      appenders: ['access'],
      level: logLevel
    }
  }
});

module.exports = log4js;
