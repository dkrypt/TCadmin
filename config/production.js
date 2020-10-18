module.exports = {
  app: {
    name: 'tc-admin',
    deployment: 'production',
    hostname: '',
    port: 9090,
    certs_dir: './certs',
    ca_filename: 'tc_ca.pem',
    pvt_key_filename: 'tc_pvt_key.pem',
    pub_cert_filename: 'tc_pub_cert.pem',
    admin_username: '',
    admin_password: '',
    connector_monitor_enabled: false,
    connector_monitor_report_level: 2,
    connector_report_directory: './out/reports',
    connector_monitor_cron: '',
    nurego_token_url: '',
    nurego_endpoint: '',
    nurego_username: '',
    nurego_password: '',
    nurego_instance_id: '',
    nurego_reporting_enabled: false,
    nurego_reporting_duration: 36000
  },
  tc: {
    url: '',
    api_url: '',
    id_provider: ''
  },
  logging: {
    compress: true,
    log_directory: './logs',
    filename: 'tc-admin.log',
    level: 'info',
    max_size: 209715200,
    max_backup_files: 5,
    subscription_id: ''
  }
};
