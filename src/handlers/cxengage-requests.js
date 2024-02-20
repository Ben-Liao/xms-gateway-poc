const axios = require('axios');

const {
  v1: uuidv1,
} = require('uuid');

const logger = require('../utils/logger');
const secrets = require('../utils/aws-secrets-manager');
const errors = require('../utils/errors');

const {
  CXENGAGE_REGION,
  CXENGAGE_ENVIRONMENT,
  CXENGAGE_DOMAIN,
} = process.env;

const VERSION = 'v1';

/**
 * Send HTTP GET request to CxEngage Cloud.
 *
 * @param {string} path the path after base url "https://<base-url>/v1/<path>"
 *
 * @returns
 *  Success: {status: 0, body: {response: <get result json object>}}
 *  Failure: {status: <non zero error code>, body: {message: <string>, error: <json object>}}
 */
async function getRequest(path) {
  // Get secret from AWS secret manager required to communicate with CxEngage
  const cxSecretName = secrets.getCxEngageSecretName();
  const secretRes = secrets.getSecret(cxSecretName);
  if (!secretRes) {
    return {
      status: errors.FAILED_GET_SECRET_VALUE,
      body: {
        message: 'failed to get required secret',
      },
    };
  }

  // Get users from CxEngage for tenant
  const restUrl = `https://${CXENGAGE_REGION}-${CXENGAGE_ENVIRONMENT}-edge.${CXENGAGE_DOMAIN}/${VERSION}/${path}`;
  logger.debug('getRequest: restUrl:', restUrl);

  try {
    const { data } = await axios({
      method: 'get',
      url: restUrl,
      auth: secretRes,
    });
    logger.debug(`getRequest: [${path}] data: `, data);

    return {
      status: errors.STATUS_NO_ERROR,
      body: (Object.prototype.hasOwnProperty.call(data, 'result') ? data.result : data),
    };
  } catch (err) {
    logger.error('getRequest:', err);
    return {
      status: errors.HTTP_GET_REQ_TO_CX_FAILED,
      body: {
        message: 'failed, http get request',
        error: err.response.data,
      },
    };
  }
}

/**
 * Send HTTP POST request to CxEngage Cloud.
 *
 * @param {string} path the path after base url "https://<base-url>/v1/<path>"
 *
 * @returns
 *  Success: {status: 0, body: {response: <get result json object>}}
 *  Failure: {status: <non zero error code>, body: {message: <string>, error: <json object>}}
 */
async function postRequest(path, payload) {
  // Get secret from AWS secret manager required to communicate with CxEngage
  const cxSecretName = secrets.getCxEngageSecretName();
  const secretRes = secrets.getSecret(cxSecretName);
  if (!secretRes) {
    return {
      status: errors.FAILED_GET_SECRET_VALUE,
      body: {
        message: 'failed to get required secret',
      },
    };
  }
  // Get the secret string from the secret
  const authStr = `${secretRes.username}:${secretRes.password}`;

  // Get users from CxEngage for tenant
  const restUrl = `https://${CXENGAGE_REGION}-${CXENGAGE_ENVIRONMENT}-edge.${CXENGAGE_DOMAIN}/${VERSION}/${path}`;
  logger.debug('postRequest: restUrl:', restUrl);

  const headers = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${Buffer.from(authStr).toString('base64')}`,
    },
  };
  logger.debug('postRequest: headers:', headers);

  try {
    const { data } = await axios.post(
      restUrl,
      payload,
      headers,
    );
    logger.debug(`getRequest: [${path}] data: `, data);

    return {
      status: errors.STATUS_NO_ERROR,
      body: (Object.prototype.hasOwnProperty.call(data, 'result') ? data.result : data),
    };
  } catch (err) {
    logger.error('Errorr to send post to cxEngage:', err);
    if (err.response && err.response.data) {
      logger.error('Error response data:', err.response.data);
    }
    return {
      status: errors.HTTP_GET_REQ_TO_CX_FAILED,
      body: {
        message: 'failed, http get request',
        error: err.response ? err.response.data : {},
      },
    };
  }
}

async function sendActionResponse({
  tenantId, interactionId, actionId, subId, metadata = {}, update = {},
}) {
  // let inMeta;
  // let inUpdate;

  // if (Object.keys(metadata).length === 0) {
  //   inMeta = {};
  // } else {
  //   inMeta = metadata;
  // }

  // if (Object.keys(update).length === 0) {
  //   inUpdate = {};
  // } else {
  //   inUpdate = update;
  // }

  logger.info('sendActionResponse is called', {
    tenantId, interactionId, actionId, subId, metadata, update,
  });

  // Get secret from AWS secret manager required to communicate with CxEngage
  const cxSecretName = secrets.getCxEngageSecretName();
  const secretRes = secrets.getSecret(cxSecretName);
  if (!secretRes) {
    return {
      status: errors.FAILED_GET_SECRET_VALUE,
      body: {
        message: 'failed to get required secret',
      },
    };
  }
  // Get the secret string from the secret
  const authStr = `${secretRes.username}:${secretRes.password}`;
  const headers = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${Buffer.from(authStr).toString('base64')}`,
    },
  };

  const url = `https://${CXENGAGE_REGION}-${CXENGAGE_ENVIRONMENT}-edge.${CXENGAGE_DOMAIN}/${VERSION}/tenants/${tenantId}/interactions/${interactionId}/actions/${actionId}`;

  const data = {
    'tenant-id': tenantId,
    'interaction-id': interactionId,
    'action-id': actionId,
    source: 'xms',
    'sub-id': subId,
    metadata,
    update,
  };

  logger.info('sending action response ', {
    tenantId, interactionId, actionId, subId, url, data,
  });

  try {
    const { response } = await axios.post(
      url,
      data,
      headers,
    );
    logger.debug(`sendActionResponse: [${actionId}] data: `, response);

    return {
      status: errors.STATUS_NO_ERROR,
      body: (Object.prototype.hasOwnProperty.call(response, 'result') ? response.result : response),
    };
  } catch (err) {
    logger.error('sendActionResponse:', err);
    return {
      status: errors.HTTP_POST_REQ_TO_CX_FAILED,
      body: {
        message: 'failed, http post request',
        error: err,
      },
    };
  }
}

async function getAction({
  tenantId, interactionId, actionId, subId,
}) {
  // Get secret from AWS secret manager required to communicate with CxEngage
  const cxSecretName = secrets.getCxEngageSecretName();
  const secretRes = secrets.getSecret(cxSecretName);
  if (!secretRes) {
    return {
      status: errors.FAILED_GET_SECRET_VALUE,
      body: {
        message: 'failed to get required secret',
      },
    };
  }

  try {
    const { data } = await axios({
      method: 'get',
      url: `https://${CXENGAGE_REGION}-${CXENGAGE_ENVIRONMENT}-edge.${CXENGAGE_DOMAIN}/${VERSION}/tenants/${tenantId}/interactions/${interactionId}/actions/${actionId}?id=${uuidv1()}&sub-id=${subId}&source=plivo`,
      auth: secretRes,
    });
    return data;
  } catch (error) {
    logger.error('error while seding action response', error);
    return {
      status: errors.HTTP_GET_REQ_TO_CX_FAILED,
      body: {
        message: 'failed, http post request',
        error: error.response.data,
      },
    };
  }
}

async function createInteraction(tenantId, interactionParams) {
  const path = `tenants/${tenantId}/interactions`;
  logger.info('creating interaction', { tenantId, path, interactionParams });
  let interaction;
  try {
    const { body } = await postRequest(path, interactionParams);
    interaction = body;
  } catch (error) {
    logger.error('error while seding action response', error);
    return {
      status: errors.HTTP_POST_REQ_TO_CX_FAILED,
      body: {
        message: 'Faild to create interaction',
        error: error.response.data,
      },
    };
  }
  return interaction;
}

async function updateInteractionMetadata({ tenantId, interactionId, metadata }) {
  // Get secret from AWS secret manager required to communicate with CxEngage
  const cxSecretName = secrets.getCxEngageSecretName();
  const secretRes = secrets.getSecret(cxSecretName);
  if (!secretRes) {
    return {
      status: errors.FAILED_GET_SECRET_VALUE,
      body: {
        message: 'failed to get required secret',
      },
    };
  }
  // Get the secret string from the secret
  const authStr = `${secretRes.username}:${secretRes.password}`;

  const url = `https://${CXENGAGE_REGION}-${CXENGAGE_ENVIRONMENT}-edge.${CXENGAGE_DOMAIN}/${VERSION}/tenants/${tenantId}/interactions/${interactionId}/metadata?id=${uuidv1()}`;
  const headers = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${Buffer.from(authStr).toString('base64')}`,
    },
  };

  const actionData = {
    source: 'xms',
    metadata,
  };
  logger.debug('sending interaction metadata update request ', { url, headers, actionData });

  try {
    const { data } = await axios.post(
      url,
      actionData,
      headers,
    );
    return data;
  } catch (error) {
    logger.info('Failed to update interaction metadata', error);
    return {
      status: errors.HTTP_POST_REQ_TO_CX_FAILED,
      body: {
        message: 'failed, http post request',
        error: error.response.data,
      },
    };
  }
}

async function getMetadata({ tenantId, interactionId }) {
  // Get secret from AWS secret manager required to communicate with CxEngage
  const cxSecretName = secrets.getCxEngageSecretName();
  const secretRes = secrets.getSecret(cxSecretName);
  if (!secretRes) {
    return {
      status: errors.FAILED_GET_SECRET_VALUE,
      body: {
        message: 'failed to get required secret',
      },
    };
  }
  return axios({
    method: 'get',
    url: `https://${CXENGAGE_REGION}-${CXENGAGE_ENVIRONMENT}-edge.${CXENGAGE_DOMAIN}/${VERSION}/tenants/${tenantId}/interactions/${interactionId}/metadata`,
    auth: secretRes,
  });
}

async function sendInterrupt({tenantId, interactionId,interactionParams}) {
  const path = `tenants/${tenantId}/interactions`;
  logger.info('creating interaction', { tenantId, path, interactionParams });
  let interaction;
  try {
    const { body } = await postRequest(path, interactionParams);
    interaction = body;
  } catch (error) {
    logger.error('error while seding action response', error);
    return {
      status: errors.HTTP_POST_REQ_TO_CX_FAILED,
      body: {
        message: 'Faild to create interaction',
        error: error.response.data,
      },
    };
  }
  return interaction;
}

module.exports = {
  getRequest,
  postRequest,
  sendActionResponse,
  getAction,
  updateInteractionMetadata,
  getMetadata,
  createInteraction,
};
