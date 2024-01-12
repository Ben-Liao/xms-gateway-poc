const AWS = require('aws-sdk');
require('aws-sdk/lib/maintenance_mode_message').suppress = true;

const errors = require('./errors');
const logger = require('./logger');

const {
  CXENGAGE_REGION,
  CXENGAGE_ENVIRONMENT,
} = process.env;

AWS.config.update({ region: CXENGAGE_REGION });
const secretsClient = new AWS.SecretsManager();

// Secrets that we have acquired
const acquiredSecrets = new Map();

/**
 * Method to get full name of the secret in AWS secrets manager used for CxEngage
 *
 * @description
 * Secret name is generated using REGION, CXENGAGE_ENVIRONMENT name
 * This method combines all the parts and creates full name
 *
 * @param Empty
 *
 * @return
 *  String:: secret name
 */
function getCxEngageSecretName() {
  return `${CXENGAGE_REGION}-${CXENGAGE_ENVIRONMENT}-smooch-cx`;
}

/**
 * Method to Get secret value from AWS secrets manager
 *
 * @param {string} secretId - Secret Name
 *
 * @return
 *  Success: {status: 0, body: {data: <secret details in JSON format>>}}
 *  Failure: {status: <non zero error code>, body: {error: <Secrets manager error JSON Object>}}
 */
async function getSecretValue(secretId) {
  try {
    const secretRet = await secretsClient.getSecretValue({ SecretId: secretId }).promise();
    return {
      status: errors.STATUS_NO_ERROR,
      body: {
        data: secretRet,
      },
    };
  } catch (err) {
    logger.error('Failed to get CX secret: ', err);
    throw new Error({
      status: errors.FAILED_GET_SECRET_VALUE,
      body: {
        error: err,
      },
    });
  }
}

/**
 * Store retrieved secret for fast access based on id
 *
 * @param {string} secretId ID of the secret to store
 * @param {string} value string value of secret
 */
function storeSecret(secretId, value) {
  acquiredSecrets.set(secretId, JSON.parse(value));
}

/**
 * Retrieve secret value based on id
 *
 * @param {string} secretId ID of the secret to store
 * @return secret object for the secret id, null if not found
 */
function getSecret(secretId) {
  return acquiredSecrets.get(secretId);
}

module.exports = {
  storeSecret,
  getSecret,
  getSecretValue,
  getCxEngageSecretName,
};
