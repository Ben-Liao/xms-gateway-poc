const { validate: uuidValidate } = require('uuid');
const logger = require('../utils/logger');

const common = require('../utils/common');
const cxRequests = require('./cxengage-requests');
const errors = require('../utils/errors');
const xmsRequests = require('./xms-requests');
const DynamoDBAccess = require('../db/dynamo-access');

const {
  CXENGAGE_REGION,
  CXENGAGE_ENVIRONMENT,
  CXENGAGE_DOMAIN,
} = process.env;

// const serverURL = `https://${CXENGAGE_REGION}-${CXENGAGE_ENVIRONMENT}-xms-gateway.${CXENGAGE_DOMAIN}`;
const serverURL = 'https://8c5d-159-2-180-142.ngrok-free.app ';

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
  logger.info('/dial acition is called', logContext);

  let meta = {};

  if (!metadata || Object.keys(metadata).length === 0) {
    logger.info('metadata is empty', logContext);

    try {
      // const callBackUri = `${serverURL}/webhook/tenant/${tenantId}/webhook`;
      // logger.info('callBackUri', callBackUri);
      // // call the xmsserver to create a call back webhook.
      // const xmsEvent = await xmsRequests.createWebHookRequest(tenantId, interactionId, callBackUri);
      // logger.info('XMS event is created', { ...logContext, xmsEvent });

      // Create a call
      const source = 'sip:xmserver@107.20.26.214';
      const destination = `sip:+${parameters.to}@52.39.73.217`;

      const xmsCallResponse = await xmsRequests.createCallRequest(
        tenantId,
        interactionId,
        source,
        destination,
      );
      logger.info('XMS call is created', { ...logContext, xmsCallResponse });
      const callId = xmsCallResponse.body.call_response.identifier;

      DynamoDBAccess.saveCallResource(tenantId, interactionId, callId, {});

      // Create a conferences:
      const xmsConferenceParams = {
        type: 'audio',
        max_parties: 4,
      };

      logger.info('Prepare for xms conference ', { ...logContext, xmsConferenceParams });
      const confResponse = await xmsRequests.createConferenceRequest(
        tenantId,
        interactionId,
        xmsConferenceParams,
      );

      if (confResponse.status !== errors.STATUS_NO_ERROR) {
        logger.error('Failed to create conference', { ...logContext, confResponse });
        throw new Error('Failed to create XMS conference');
      }
      const conferenceResponse = confResponse.body.web_service.conference_response[0].$;
      logger.info('XMS conference is created', { ...logContext, conferenceResponse });

      const conferenceId = conferenceResponse.identifier;

      DynamoDBAccess.addConferenceAndAssociateCalls(
        tenantId,
        interactionId,
        conferenceId,
        { CallResourceID: callId },
      );

      // build the metadata
      meta = {
        'xms-event': xmsEvent.body,
        'xms-conference': conferenceResponse,
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
  const { body, params } = req;
  logger.debug('/play-media action is called, req.params', { params, body });

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

  logger.info(`Prepare to process ${actionName} action`, logContext);
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
async function playMedia(req, res) {
  const { body, params } = req;
  logger.info('/play-media action is called, req.params', { params, body });

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

  logger.info(`Prepare to process ${actionName} action`, logContext);
  const resourceId = metadata.events[0]['resource-id'];
  let callAction = {};
  const { media } = parameters;
  const { type } = media;
  switch (type) {
    case 'audio':
      callAction = {
        play: {
          $: {
            delay: '0s',
            max_time: 'infinite',
            offset: '0s',
            repeat: '0',
            skip_interval: '10s',
            terminate_digits: '#',
          },
          play_source: {
            $: { location: media.source || 'file://xmstool/xmstool_play' },
          },
          dvr_setting: {
            $: {
              backward_key: '2',
              forward_key: '1',
              pause_key: '3',
              restart_key: '5',
              resume_key: '4',
            },
          },
        },
      };
      break;
    case 'tts':
      callAction = {
        play: {
          type: 'tts',
          text: parameters.media.text,
        },
      };
      break;
    default:
      break;
  }

  try {
    logger.debug('Wait for 3 second', { ...logContext, callAction });
    await new Promise((resolve) => setTimeout(resolve, 3000));
    logger.debug('Play media request after 3 second', { ...logContext, callAction });
    const response = await xmsRequests.playMediaRequest(tenantId, interactionId, resourceId, callAction);
    logger.info('XMS play media response', { ...logContext, response });

    // Handle the HTTP POST "playMedia" request here
    // Generate a successful response
    res.status(200).json({ message: 'Play media request successful' });
  } catch (error) {
    // Handle any errors that occur during the request handling
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  dial,
  modifyCall,
  playMedia,
};
