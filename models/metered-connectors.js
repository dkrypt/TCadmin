'use strict';

const connectors = {};

connectors.mapping = {
  CaptureChangeMySQL: ['MySQL Hosts'],
  ConnectWebSocket: ['WebSocket Client Id'],
  ConsumeAMQP: ['Host Name', 'Port'],
  ConsumeAQ: ['Database Connection Pooling Service'],
  ConsumeAzureEventHub: ['Event Hub Namespace', 'Event Hub Name'],
  ConsumeEWS: ['User Name', 'Password'],
  ConsumeIMAP: ['Host Name', 'Port'],
  ConsumeJMS: ['Connection Factory Service', 'Destination Name'],
  ConsumeKafka: ['Kafka Brokers', 'Topic Name(s)', 'Group ID'],
  ConsumeKafka_0_10: ['Kafka Brokers', 'Topic Name(s)', 'Group ID'],
  ConsumeKafka_0_11: ['Kafka Brokers', 'Topic Name(s)', 'Group ID'],
  ConsumeKafka_1_0: ['Kafka Brokers', 'Topic Name(s)', 'Group ID'],
  ConsumeKafkaRecord_0_10: ['Kafka Brokers', 'Topic Name(s)', 'Group ID'],
  ConsumeKafkaRecord_0_11: ['Kafka Brokers', 'Topic Name(s)', 'Group ID'],
  ConsumeKafkaRecord_1_0: ['Kafka Brokers', 'Topic Name(s)', 'Group ID'],
  ConsumeMQTT: ['Broker URI', 'Client ID'],
  ConsumePOP3: ['Host Name', 'Port', 'User Name', 'Password'],
  DeleteDynamoDB: ['Table Name', 'Region'],
  DeleteElasticsearch5: ['Cluster Name', 'ElasticSearch Hosts'],
  DeleteGCSObject: ['GCP Credentials Provider Service', 'Project ID'],
  DeleteMongo: ['Mongo URI', 'Mongo Database Name'],
  DeleteRethinkDB: ['Hostname', 'DB Port', 'DB Name'],
  DeleteS3Object: ['Region', 'Bucket'],
  DeleteSQS: ['Region', 'Queue URL'],
  ExecuteBAPI: ['Connection'],
  ExecutePLSQL: ['Database Connection Pooling Service', 'Database Schema'],
  ExecuteSOQL: ['Connection'],
  ExecuteSparkInteractive: ['Livy Controller Service'],
  ExecuteSQL: ['Database Connection Pooling Service'],
  FetchAzureBlobStorage: ['Storage Account Name', 'Container Name'],
  FetchElasticsearch: ['ElasticSearch Hosts', 'Cluster Name'],
  FetchElasticsearch5: ['ElasticSearch Hosts', 'Cluster Name'],
  FetchElasticsearchHttp: ['Elasticsearch URL'],
  FetchFTP: ['Hostname', 'Port'],
  FetchGCSObject: ['GCP Credentials Provider Service', 'Project ID'],
  FetchHBaseRow: ['HBase Client Service'],
  FetchS3Object: ['Region', 'Bucket'],
  FetchSFTP: ['Hostname', 'Port'],
  GenerateTableFetch: ['Database Connection Pooling Service', 'Database Type'],
  GetAzureEventHub: ['Event Hub Name', 'Event Hub Namespace'],
  GetCouchbaseKey: ['Couchbase Cluster Controller Service'],
  GetDynamoDB: ['Region', 'Table Name'],
  GetFTP: ['Hostname', 'Port'],
  GetHBase: ['HBase Client Service'],
  GetHTMLElement: ['URL'],
  GetHTTP: ['URL'],
  GetIDOC: ['SAPService'],
  GetJMSQueue: ['URL', 'Destination Name'],
  GetJMSTopic: ['URL', 'Destination Name'],
  GetKafka: ['ZooKeeper Connection String', 'Topic Name'],
  GetMongo: ['Mongo URI', 'Mongo Database Name'],
  GetRethinkDB: ['Hostname', 'DB Port', 'DB Name'],
  GetSFTP: ['Hostname', 'Port'],
  GetSNMP: ['Host Name', 'Port'],
  GetSolr: ['Solr Location'],
  GetSplunk: ['Hostname', 'Port'],
  GetSQS: ['Region', 'Queue URL'],
  GetTCP: ['Endpoint List'],
  GetTwitter: ['Twitter Endpoint'],
  HandleHttpRequest: ['Listening Port'],
  InvokeFBDI: ['Oracle Fusion Connection Service'],
  InvokeHTTP: ['Remote URL', 'HTTP Method'],
  InvokeHttpOAuth2: ['Remote URL', 'HTTP Method'],
  ListAzureBlobStorage: ['Storage Account Name', 'Container Name'],
  ListDatabaseTables: ['Database Connection Pooling Service'],
  ListenBeats: ['Port'],
  ListenHTTP: ['Listening Port'],
  ListenLumberjack: ['Port'],
  ListenRELP: ['Port'],
  ListenSMTP: ['Listening Port'],
  ListenSyslog: ['Port'],
  ListenTCP: ['Port'],
  ListenTCPRecord: ['Port'],
  ListenUDP: ['Port'],
  ListenUDPRecord: ['Port'],
  ListenWebSocket: ['WebSocket Server ControllerService'],
  ListFTP: ['Hostname', 'Port'],
  ListGCSBucket: ['GCP Credentials Provider Service', 'Project ID'],
  ListS3: ['Region', 'Bucket'],
  ListSFTP: ['Hostname', 'Port'],
  PostHTTP: ['URL'],
  PostIDOC: ['Connection'],
  PredixEventHubPublish: ['gRPC Service Hostname', 'gRPC Service Port'],
  PredixEventHubSubscribe: ['gRPC Service Hostname', 'gRPC Service Port'],
  PredixTimeseriesIngest: ['Predix Zone ID Header Value'],
  PublishAMQP: ['Host Name', 'Port'],
  PublishAQ: ['Database Connection Pooling Service', 'Database Schema', 'Queue'],
  PublishJMS: ['Connection Factory Service', 'Destination Name'],
  PublishKafka: ['Kafka Brokers', 'Topic Name'],
  PublishKafka_0_10: ['Kafka Brokers', 'Topic Name'],
  PublishKafka_0_11: ['Kafka Brokers', 'Topic Name'],
  PublishKafka_1_0: ['Kafka Brokers', 'Topic Name'],
  PublishKafkaRecord_0_10: ['Kafka Brokers', 'Topic Name'],
  PublishKafkaRecord_0_11: ['Kafka Brokers', 'Topic Name'],
  PublishKafkaRecord_1_0: ['Kafka Brokers', 'Topic Name'],
  PublishMQTT: ['Broker URI', 'Client ID', 'Topic'],
  PutAzureBlobStorage: ['Container Name', 'Storage Account Name'],
  PutAzureEventHub: ['Event Hub Name', 'Event Hub Namespace'],
  PutCassandraQL: ['Cassandra Contact Points'],
  PutCloudWatchMetric: ['Region', 'Metric Name', 'Namespace'],
  PutCouchbaseKey: ['Couchbase Cluster Controller Service', 'Bucket Name'],
  PutDatabaseRecord: ['Database Connection Pooling Service'],
  PutDynamoDB: ['Region', 'Table Name'],
  PutElasticsearch: ['ElasticSearch Hosts', 'Cluster Name'],
  PutElasticsearch5: ['ElasticSearch Hosts', 'Cluster Name'],
  PutElasticsearchHttp: ['Elasticsearch URL'],
  PutElasticsearchHttpRecord: ['Elasticsearch URL'],
  PutEmail: ['SMTP Hostname', 'SMTP Port'],
  PutFTP: ['Hostname', 'Port'],
  PutGCSObject: ['GCP Credentials Provider Service', 'Project ID'],
  PutHBaseCell: ['HBase Client Service'],
  PutHBaseJSON: ['HBase Client Service'],
  PutHBaseRecord: ['HBase Client Service'],
  PutHiveQL: ['Hive Database Connection Pooling Service'],
  PutHiveStreaming: ['Hive Metastore URI', 'Database Name'],
  PutJMS: ['URL', 'Destination Name'],
  PutKafka: ['Known Brokers', 'Topic Name'],
  PutKinesisFirehose: ['Amazon Kinesis Firehose Delivery Stream Name', 'Region'],
  PutKinesisStream: ['Region', 'Amazon Kinesis Stream Name'],
  PutKudu: ['Kudu Masters'],
  PutLambda: ['Region', 'Amazon Lambda Name'],
  PutMongo: ['Mongo URI', 'Mongo Database Name'],
  PutMongoRecord: ['Mongo URI', 'Mongo Database Name'],
  PutRethinkDB: ['Hostname', 'DB Port', 'DB Name'],
  PutRiemann: ['Riemann Address', 'Riemann Port'],
  PutS3Object: ['Region', 'Bucket'],
  PutSFTP: ['Hostname', 'Port'],
  PutSlack: ['Webhook URL'],
  PutSNS: ['Region', 'Amazon Resource Name (ARN)'],
  PutSolrContentStream: ['Solr Location'],
  PutSplunk: ['Hostname', 'Port'],
  PutSQL: ['JDBC Connection Pool'],
  PutSQS: ['Region', 'Queue URL'],
  PutSyslog: ['Hostname', 'Port'],
  PutTCP: ['Hostname', 'Port'],
  PutUDP: ['Hostname', 'Port'],
  QueryCassandra: ['Cassandra Contact Points'],
  QueryDatabaseTable: ['Database Connection Pooling Service', 'Database Type'],
  QueryElasticsearchHttp: ['Elasticsearch URL'],
  QueryWhois: ['Whois Server', 'Whois Server Port'],
  ScrollElasticsearchHttp: ['Elasticsearch URL'],
  SelectHiveQL: ['Hive Database Connection Pooling Service'],
  SetSNMP: ['Host Name', 'Port'],
  StoreInKiteDataset: ['Target dataset URI']
};

connectors.mapExists = (type) => {
  return connectors.mapping.hasOwnProperty(type);
};

/**
 * Gets a unique key string based on a predefined mapping that should be
 * used to determine a count for number of connectors.
 *
 * @param {Object} item
 * @return {(String|null)} uniqueKey will be returned if valid object and mapping
 *  exists for the connector item provided. null will be returned otherwise.
 */
connectors.getUniqueKey = (item) => {
  // Validate object properties, return null if invalid
  if (!item.id ||
    !item.status ||
    !item.status.aggregateSnapshot ||
    !item.status.aggregateSnapshot.type ||
    !item.component ||
    !item.component.config ||
    !item.component.config.properties) {
    return null;
  }
  const type = item.status.aggregateSnapshot.type;

  // If there is not a known mapping, return null for the unique key
  if (!connectors.mapExists(type)) {
    return null;
  }

  let uniqueKey = `${type}:`;
  for (const key in connectors.mapping[type]) {
    const prop = connectors.mapping[type][key];
    if (item.component.config.properties[prop]) {
      uniqueKey += `${item.component.config.properties[prop]}:`;
    }
  }
  return uniqueKey;
};

module.exports = connectors;
