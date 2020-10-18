FROM openjdk:8-alpine

##############
ARG UID=1000
ARG GID=1000
##############

LABEL maintainer="Thread Connect"

ENV TC_ADMIN_BASE_DIR=/usr/src/app \
    TC_ADMIN_DEPLOY_ENV=production \
    TC_ADMIN_LOG_DIR=/usr/src/app/logs \
    TC_ADMIN_LOG_FILE=tc-admin.log \
    TC_ADMIN_REPORT_DIR=/usr/src/app/out/reports \
    TC_ADMIN_CERTS_DIR=/usr/src/app/certs

ADD sh/ ${TC_ADMIN_BASE_DIR}/scripts

RUN apk update && apk add --upgrade bash curl nodejs npm && \
    rm -rf /var/cache/apk/* && \
    addgroup -g ${GID} nifi && \
    adduser -D -s /bin/bash -u ${UID} -G nifi nifi && \
    ls -altr ${TC_ADMIN_BASE_DIR} && \
    node -v && \
    npm -v

WORKDIR ${TC_ADMIN_BASE_DIR}

COPY package*.json ./

RUN npm install

COPY . .

RUN chown -R nifi:nifi ${TC_ADMIN_BASE_DIR} && \
    find ${TC_ADMIN_BASE_DIR}/scripts/ -type f -iname "*.sh" -exec chmod +x {} \;

EXPOSE 9090

USER nifi

CMD ${TC_ADMIN_BASE_DIR}/scripts/start_tc_admin.sh