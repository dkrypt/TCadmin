#!/bin/sh -e

scripts_dir=${TC_ADMIN_BASE_DIR}/sh

# Create required directories
mkdir -p ${TC_ADMIN_LOG_DIR} ${TC_ADMIN_REPORT_DIR}

#Start application in background
nohup npm run ${TC_ADMIN_DEPLOY_ENV} >> ${TC_ADMIN_LOG_DIR}/${TC_ADMIN_LOG_FILE} &

# Tail logs to stdout
tail  -F ${TC_ADMIN_LOG_DIR}/${TC_ADMIN_LOG_FILE}
