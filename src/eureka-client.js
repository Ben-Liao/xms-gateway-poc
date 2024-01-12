const { Eureka } = require('eureka-js-client');
const path = require('path');
const fs = require('fs');

const appState = require('./state');
const common = require('./utils/common');
const errors = require('./utils/errors');
const logger = require('./utils/logger');

const PROP_FILE_FOLDER = 'resources';
const PROP_FILE_NAME = 'xms-gateway.properties';
const PROP_YAML_FILE_NAME = 'xms-gateway-prop';
const DOT_YAML = '.yml';

/**
 * Eureka client for connecting to eureka env specific discovery service
 *
 * @returns
 */
async function initConnection() {
  try {
    // Replace file with ENV variables
    const cmdResult = await common.execShellCommand(
      'envsubst',
      [
        // eslint-disable-next-line no-template-curly-in-string
        ' "$(printf \'${%s} \' $(env | sed \'s/=.*//\'))"',
        ` < ${PROP_FILE_FOLDER}/${PROP_FILE_NAME}`,
        ` > ${PROP_FILE_FOLDER}/${PROP_YAML_FILE_NAME}${DOT_YAML}`,
      ],
    );
    logger.debug('initConnection: cmdResult: ', cmdResult);

    if (cmdResult.status > 0) {
      logger.error('initConnection: failed to convert property file to yaml');
      // We need to report health error
      appState.setAppStateError(
        'failed to convert property file to yaml',
      );

      return {
        status: errors.EUREKA_CLIENT_FAILURE,
        body: {
          message: 'failed to parse yaml file',
        },
      };
    }

    // Update the yaml file
    const resourcePath = path.resolve(__dirname, '..', PROP_FILE_FOLDER);
    logger.debug('initConnection: Property File PATH: ', resourcePath);

    const yamlFile = fs.readFileSync(`${resourcePath}/${PROP_YAML_FILE_NAME}${DOT_YAML}`, 'utf8');
    logger.debug('initConnection: yamlFile File: ', yamlFile);

    const eurekaClient = new Eureka({
      filename: PROP_YAML_FILE_NAME,
      cwd: resourcePath,
    });

    // eurekaClient.logger.level('debug');

    // Register event listeners
    eurekaClient.on('deregistered', eurekaDeregistered);
    eurekaClient.on('started', eurekaStarted);
    eurekaClient.on('registered', eurekaRegistered);
    eurekaClient.on('heartbeat', eurekaHeartbeat);
    eurekaClient.on('registryUpdated', eurekaRegistryUpdated);

    // Start the eureka client and register to discovery
    eurekaClient.start();

    logger.debug('initConnection: eureka registration success');
    return {
      status: errors.STATUS_NO_ERROR,
      body: {
        message: 'eureka registration success',
      },
    };
  } catch (error) {
    logger.error('initConnection: error: ', error);
    return {
      status: errors.EUREKA_CLIENT_FAILURE,
      body: {
        message: 'failed init eureka connection',
      },
    };
  }
}

function eurekaDeregistered() {
  logger.error('Eureka: eurekaDeregistered');
  // We need to report health error
  appState.setAppStateError(
    'eureka deregistered',
  );
}

function eurekaStarted() {
  logger.info('Eureka: eurekaStarted');
  // We need to report health error
  appState.setAppStateOk(
    'Eureka registration success',
  );
}

function eurekaRegistered() {
  logger.info('Eureka: eurekaRegistered');
  // We need to report health error
  appState.setAppStateOk(
    'Eureka registration success',
  );
}

function eurekaHeartbeat() {
  logger.debug('Eureka: Heartbeat');
}

function eurekaRegistryUpdated() {
  logger.debug('Eureka: RegistryUpdated');
}

module.exports = {
  initConnection,
};
