const express = require('express');
// const xmlparser = require('express-xml-bodyparser');
const xml2js = require('xml2js');
const {
  v4: uuidv4,
} = require('uuid');

const AWS = require('aws-sdk');

const logger = require('../utils/logger');
const common = require('../utils/common');
const cxRequests = require('../handlers/cxengage-requests');
const xmsRequests = require('../handlers/xms-requests');
const errors = require('../utils/errors');
const { log } = require('winston');

const docClient = new AWS.DynamoDB.DocumentClient();
const router = express.Router();

// Middleware to get raw body for specific routes
router.use((req, res, next) => {
  let data = '';
  req.setEncoding('utf8');

  req.on('data', (chunk) => {
    data += chunk;
  });

  req.on('end', () => {
    req.body = data;
    next();
  });
});

// Define the webhook route in the router
router.post('/webhook/tenant/:tenantId/webhook', async (req, res) => {
  const { body, params } = req;

  const { tenantId } = params;
  const logContext = {
    tenantId,
  };
  try {
    const xmlData = processChunkedData(body);
    logger.info('Received request from XMS: XML Data:', { ...logContext, xmlData });

    const parser = new xml2js.Parser({ explicitArray: false });
    try {
      const parsedXml = await parser.parseStringPromise(xmlData);
      logger.info('Parsed XML:', { ...logContext, parsedXml });

      if (parsedXml.web_service && parsedXml.web_service.event) {
        // Ensure 'events' is always an array
        const events = Array.isArray(parsedXml.web_service.event)
          ? parsedXml.web_service.event
          : [parsedXml.web_service.event];

        events.forEach((event) => {
          handleEvent(tenantId, event);
        });
      } else {
        logger.info('Web service or event data not found.', { ...logContext });
      }
    } catch (parseError) {
      logger.error(`XML Parsing Error for tenant ${tenantId}:`, parseError.message);
    }

    res.status(200).send('Webhook data processed successfully');
  } catch (error) {
    logger.error(`Error processing webhook for tenant ${tenantId}:`, error);
    res.status(500).send('Error processing webhook');
  }
});

function processChunkedData(rawData) {
  let xmlData = '';
  let remainingData = rawData;

  while (remainingData.length > 0) {
    // Find the position of the first new line character
    const newlinePos = remainingData.indexOf('\r\n');
    if (newlinePos === -1) {
      break; // No newline found, break the loop
    }

    // Get the size of the chunk from the chunk header
    const chunkSizeHex = remainingData.substring(0, newlinePos);
    const chunkSize = parseInt(chunkSizeHex, 16);
    if (chunkSize === 0 || Number.isNaN(chunkSize)) {
      break; // 0 size indicates end of data or invalid size
    }

    // Extract the chunk data based on the chunk size
    const chunkDataStart = newlinePos + 2; // Skip the newline characters
    const chunkDataEnd = chunkDataStart + chunkSize;
    const chunkData = remainingData.substring(chunkDataStart, chunkDataEnd);

    xmlData += chunkData;

    // Prepare remainingData for the next iteration
    remainingData = remainingData.substring(chunkDataEnd + 2); // Skip the next newline
  }

  return xmlData;
}

async function processIncomingEvent({
  tenantId, resourceId, eventType, resourceType, eventData, logContext,
}) {
  const interactionId = uuidv4();
  const { called_uri, caller_uri } = eventData;
  const from = common.extractSipAddress(caller_uri);
  const to = common.extractSipAddress(called_uri);
  const event = {
    resourceId, eventType, resourceType, eventData,
  };
  // Accept the call
  const call = {};
  call.answer = 'yes';
  call.signaling = 'yes';
  const responseData = await xmsRequests.updateCallRequest(tenantId, '', resourceId, call);
  logger.info('Call accepted', { ...logContext, responseData });

  // Create interaction:
  const interactionParams = {
    tenantId,
    id: interactionId,
    customer: from,
    contactPoint: to,
    source: 'xms',
    channelType: 'voice',
    direction: 'inbound',
    interaction: {
      customerMetadata: {
        id: from,
      },
    },
    metadata: {
      events: [event],
      participants: {
        [resourceId]: {
          type: 'customer',
          'call-uuid': resourceId,
          to,
          from,
        },
      },
    },
  };
  logger.info('Creating interaction', {
    ...logContext, interactionId, eventData, interactionParams,
  });
  const interaction = await cxRequests.createInteraction(tenantId, interactionParams);
  logger.info('Created interaction', { ...logContext, interactionId, interaction });
}

async function processIncomingEventPOC({
  tenantId, resourceId, eventType, resourceType, eventData, logContext,
}) {
  const interactionId = uuidv4();
  const { called_uri, caller_uri } = eventData;
  const from = common.extractSipAddress(caller_uri);
  const to = common.extractSipAddress(called_uri);
  const event = {
    resourceId, eventType, resourceType, eventData,
  };
  // Accept the call
  const call = {};
  call.answer = 'yes';
  call.signaling = 'yes';
  const incomeCallResponse = await xmsRequests.updateCallRequest(tenantId, '', resourceId, call);
  logger.info('Incomming Call accepted', { ...logContext, incomeCallResponse });

  // const conferenceResponse = confResponse.body.web_service.conference_response[0].$;
  // logger.info('XMS conference is created', { ...logContext, conferenceResponse });

  // Create another callresource:
  const call2to = 'sip:+18156579266@52.39.73.217';
  const call2from = 'sip:+15064715969@107.20.26.214';
  const call2Respone = await xmsRequests.createCallRequest(tenantId, interactionId, call2from, call2to);
  logger.info(`XMS call ${call2to} is created`, { ...logContext, call2Respone });
  // if (call2Respone.status !== errors.STATUS_NO_ERROR) {
  //   logger.error(`Failed to create a call to ${call2to}.`, { ...logContext, call2Respone });
  //   throw new Error('Failed to create a call', call2Respone.body);
  // }

  // const call2ResourceId = call2Respone.call_response.identifier;

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
    // throw new Error('Failed to create XMS conference');
  }
  logger.info('XMS conference is created', { ...logContext, confResponse });
}

async function handleEvent(tenantId, event) {
  // Extract common event properties
  const eventType = event.$.type;
  const resourceId = event.$.resource_id;
  const resourceType = event.$.resource_type;

  const logContext = {
    tenantId, eventType, resourceId, resourceType,
  };
  logger.info(`Handling ${eventType} event`, { ...logContext, event });

  // Extract event data into a more accessible format
  let eventData = {};
  if (event.event_data) {
    eventData = event.event_data.reduce((acc, data) => {
      acc[data['$'].name] = data['$'].value;
      return acc;
    }, {});
  }

  let responseData = {};
  let call = {};
  switch (eventType) {
    case 'incoming':
      logger.info('Handling incoming event', { ...logContext, eventData });
      // processIncomingEvent({
      //   tenantId,
      //   resourceId,
      //   eventType,
      //   resourceType,
      //   eventData,
      //   logContext,
      // });
      processIncomingEventPOC({
        tenantId,
        resourceId,
        eventType,
        resourceType,
        eventData,
        logContext,
      });
      // Process incoming event here
      // call.answer = 'yes';
      // call.signaling = 'yes';
      // responseData = await xmsRequests.updateCallRequest(tenantId, '', resourceId, call);
      break;
    case 'stream':
      logger.info('Handling stream event', logContext);
      // Process stream event here
      break;
    case 'media_started':
      logger.info('Handling media_started event', logContext);
      // Process media_started event here
      break;
    case 'answered':
      logger.info('Handling answered event', { ...logContext, eventData });
      // Process answered event here

      // call = {
      //   play: {
      //     $: {
      //       delay: '0s',
      //       max_time: 'infinite',
      //       offset: '0s',
      //       repeat: '0',
      //       skip_interval: '10s',
      //       terminate_digits: '#',
      //     },
      //     play_source: {
      //       $: { location: 'file://xmstool/xmstool_play' },
      //     },
      //     dvr_setting: {
      //       $: {
      //         backward_key: '2',
      //         forward_key: '1',
      //         pause_key: '3',
      //         restart_key: '5',
      //         resume_key: '4',
      //       },
      //     },
      //   },
      // };
      // responseData = await xmsRequests.playMediaRequest(tenantId, '', resourceId, call);
      // TODO do the interrupt update
      break;
    default:
      logger.warn(`Unhandled event type ${eventType}:`, { ...logContext, eventType: event.type });
    // Handle unknown event type
  }

  logger.info(`Event: ${eventType} response: `, { ...logContext, responseData });
}

module.exports = router;
