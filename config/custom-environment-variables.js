module.exports = {
  app: {
    deployment: 'NODE_ENV',
    hostname: 'TC_ADMIN_WEB_HOST',
    port: 'TC_ADMIN_PORT',
    certs_dir: 'TC_ADMIN_CERTS_DIR',
    ca_filename: 'TC_CA_FILENAME',
    pvt_key_filename: 'TC_PVT_KEY_FILENAME',
    pub_cert_filename: 'TC_PUB_CERT_FILENAME',
    admin_username: 'TC_ADMIN_USERNAME',
    admin_password: 'TC_ADMIN_PASSWORD',
    connector_monitor_enabled: 'CONNECTOR_MONITOR_ENABLED',
    connector_monitor_report_level: 'ROOT_LEVEL_DEPTH',
    connector_report_directory: 'CONNECTOR_REPORT_DIR',
    connector_monitor_cron: 'CONNECTOR_MONITOR_CRON',
    nurego_token_url: 'NUREGO_TOKEN_URL',
    nurego_endpoint: 'NUREGO_ENDPOINT',
    nurego_username: 'NUREGO_TKN_USR',
    nurego_password: 'NUREGO_TKN_PWD',
    nurego_instance_id: 'NUREGO_TKN_INS',
    nurego_reporting_enabled: 'NUREGO_REPORTING_ENABLED',
    nurego_reporting_duration: 'REPORT_DURATION'
  },
  tc: {
    url: 'TC_URL',
    api_url: 'TC_API_URL',
    id_provider: 'TC_IDENTITY_PROVIDER'
  },
  logging: {
    log_directory: 'TC_ADMIN_LOG_DIR',
    filename: 'TC_ADMIN_LOG_FILE',
    level: 'TC_ADMIN_LOG_LEVEL',
    max_size: 'MAX_LOG_SIZE',
    max_backup_files: 'MAX_LOG_HISTORY',
    subscription_id: 'TC_SUBS_ID'
  }
};
