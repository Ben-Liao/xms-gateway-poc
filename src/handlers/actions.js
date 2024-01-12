const { validate: uuidValidate } = require('uuid');
const logger = require('../utils/logger');

const common = require('../utils/common');
const cxRequests = require('../utils/cxengage-requests');
const errors = require('../utils/errors');
const xmsRequests = require('../utils/xms-requests');

const {
  CXENGAGE_REGION,
  CXENGAGE_ENVIRONMENT,
  CXENGAGE_DOMAIN,
} = process.env;

// const serverURL = `https://${CXENGAGE_REGION}-${CXENGAGE_ENVIRONMENT}-xms-gateway.${CXENGAGE_DOMAIN}`;
const serverURL = 'https://313e-159-2-180-142.ngrok-free.app';

async function dial(req, res) {
  const { body, params } = req;
  logger.info('/dial: called: req.params', params);

  let { tenantId, interactionId } = req.params;
  if (!tenantId || !uuidValidate(tenantId)) {
    tenantId = req.body['tenant-id'];
  }

  if (!interactionId || !uuidValidate(interactionId)) {
    interactionId = req.body['interaction-id'];
  }

  const {
    'action-name': actionName,
    id,
    'sub-id': subId,
    parameters,
    metadata,
  } = body;

  const actionId = id;

  const logContext = {
    'tenant-id': tenantId,
    'interaction-id': interactionId,
    'action-id': actionId,
    params: req.body,
  };

  logger.info('action-id:', actionId);
  logger.info('/dial: called', logContext);

  let meta = {};

  if (!metadata || Object.keys(metadata).length === 0) {
    // Add your code here
    logger.info('metadata is empty', logContext);

    try {
      const callBackUri = `${serverURL}/webhook/tenant/${tenantId}/interaction/${interactionId}`;
      logger.info('callBackUri', callBackUri);
      // call the xmsserver to create a call back webhook.
      const xmsEvent = await xmsRequests.createWebHookRequest(tenantId, interactionId, callBackUri);
      logger.info('XMS event is created', { ...logContext, xmsEvent });

      // build the metadata
      meta = {
        'xms-event': xmsEvent,
        participants: { source: parameters.to },
      };

      // update the interaction metadata
      const metaUpdateRespone = await cxRequests.updateInteractionMetadata({
        tenantId,
        interactionId,
        metadata: meta,
      });

      logger.info('metaUpdateRespone', { ...logContext, metaUpdateRespone });
    } catch (error) {
      // Handle any errors that occur during the request handling
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    // Add your code here
    logger.info('metadata is not empty', logContext);
    const {
      'xms-event': xmsEvent,
      participants,
    } = metadata;


    
    try {
      // Handle the HTTP POST "dial" request here
      // Generate a successful response

    } catch (error) {
      // Handle any errors that occur during the request handling
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Send action update response.
  const actionRep = await cxRequests.sendActionResponse({
    tenantId,
    interactionId,
    actionId,
    subId,
    metadata: meta,
    update: {},
  });

  logger.info(`Responding to the ${actionName} action:`, { ...logContext, actionRep });

  // Generate a successful response
  res.status(200).json({ message: 'Dial request successful' });
}

async function modifyCall(req, res) {
  const {
    'tenant-id': tenantId,
    'interaction-id': interactionId,
    'action-name': actionName,
    id: actionId,
    'sub-id': subId,
  } = req.body;

  const params = {
    tenantId,
    interactionId,
    actionName,
    actionId,
    subId,
    params: req.body,
  };

  logger.info(`/modifyCall: called to handle ${actionName}`, params);
  try {
    await cxRequests.sendActionResponse({
      tenantId, interactionId, actionId, subId,
    });

    // Handle the HTTP POST "modifyCall" request here
    // Generate a successful response
    res.status(200).json({ message: 'Modify call request successful' });
  } catch (error) {
    // Handle any errors that occur during the request handling
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  dial,
  modifyCall,
};
