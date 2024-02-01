const { validate: uuidValidate } = require('uuid');
const logger = require('../utils/logger');

const common = require('../utils/common');
const cxRequests = require('./cxengage-requests');
const errors = require('../utils/errors');
const xmsRequests = require('./xms-requests');

const {
  CXENGAGE_REGION,
  CXENGAGE_ENVIRONMENT,
  CXENGAGE_DOMAIN,
} = process.env;

// const serverURL = `https://${CXENGAGE_REGION}-${CXENGAGE_ENVIRONMENT}-xms-gateway.${CXENGAGE_DOMAIN}`;
const serverURL = 'https://fdd8-159-2-180-142.ngrok-free.app';

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
    params: body,
  };

  logger.info('action-id:', actionId);
  logger.info('/dial: called', logContext);

  let meta = {};

  if (!metadata || Object.keys(metadata).length === 0) {
    logger.info('metadata is empty', logContext);

    try {
      const callBackUri = `${serverURL}/webhook/tenant/${tenantId}/webhook`;
      logger.info('callBackUri', callBackUri);
      // call the xmsserver to create a call back webhook.
      const xmsEvent = await xmsRequests.createWebHookRequest(tenantId, interactionId, callBackUri);
      logger.info('XMS event is created', { ...logContext, xmsEvent });

      // Create a conferences:
      const xmsConferenceParams = {
        type: 'audio',
        max_parties: 4,
      };

      const conferenceResponse = await xmsRequests.createConferenceRequest({
        tenantId, interactionId, xmsConferenceParams,
      });

      const conference = conferenceResponse.body;
      logger.info('XMS conference is created', { ...logContext, conference });

      // Create a call
      const xmsCallParams = {
        tenantId,
        interactionId,
        source: 'sip:xmserver@107.20.26.214',
        destination: parameters.to,
      };

      const xmsCallResponse = await xmsRequests.createCallRequest(xmsCallParams);
      logger.info('XMS call is created', { ...logContext, xmsCallResponse });
      const callId = xmsCallResponse.body.call_response.identifier;

      // build the metadata
      meta = {
        'xms-event': xmsEvent.body,
        'xms-conference': conference,
        'xms-call-resource': [xmsCallResponse.body.call_response],
        participants: [{ [callId]: { source: parameters.to } }],
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
      res.status(500).json({
        error,
        message: 'Internal server error',
      });
    }
  } else {
    // Add your code here
    logger.info('metadata is not empty', logContext);

    const {
      'xms-event': xmsEvent,
      participants,
    } = metadata;

    // const { identifier, appId, href } = xmsEvent['web-service']['eventhandler-response'][0].$;
    const { value } = participants.source;
    const fromSource = value;

    const toPhone = parameters.to;
    const destination = `sip:${toPhone}@34.223.203.193`;

    const toDestination = { value: destination, type: 'sip' };

    metadata.participants.destination = toDestination;

    try {
      // Handle the HTTP POST "dial" request here
      logger.info('Prepare for xms call ', { ...logContext, fromSource, destination });
      // let xmsResponse;
      // xmsRequests.createCallRequest(
      //   tenantId,
      //   interactionId,
      //   fromSource,
      //   destination,
      // ).then((response) => {
      //   xmsResponse = response.body;
      //   logger.info('xms /call request responsed', xmsResponse);
      // }).catch((error) => {
      //   logger.error('Error in xms  call request', error);
      // });

      const xmsCallParams = {
        tenantId,
        interactionId,
        source: 'sip:xmserver@107.20.26.214',
        destination,
      };
      const xmsCallResponse = await xmsRequests.createCallRequest(xmsCallParams);
      logger.info('XMS call is created', { ...logContext, xmsCallResponse });
      const callId = xmsCallResponse.body.call_response.identifier;

      metadata.participants.push({ [callId]: { source: destination } });

      // update the interaction metadata
      const metaUpdateRespone = await cxRequests.updateInteractionMetadata({
        tenantId,
        interactionId,
        metadata,
      });

      logger.info('metaUpdateRespone', { ...logContext, metaUpdateRespone });
    } catch (error) {
      // Handle any errors that occur during the request handling
      res.status(500).json({
        error,
        message: 'Internal server error: faild to create xms call.',
      });
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
