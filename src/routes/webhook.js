const express = require('express');
// const xmlparser = require('express-xml-bodyparser');
const xml2js = require('xml2js');
const logger = require('../utils/logger');
const common = require('../utils/common');
const xmsRequests = require('../handlers/xms-requests');

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
    logger.info('XML Data:', { ...logContext, xmlData });

    const parser = new xml2js.Parser({ explicitArray: false });
    try {
      const parsedXml = await parser.parseStringPromise(xmlData);
      logger.info('Parsed XML:', { ...logContext, parsedXml });

      if (parsedXml.web_service && parsedXml.web_service.event) {
        // Ensure 'events' is always an array
        const events = Array.isArray(parsedXml.web_service.event)
          ? parsedXml.web_service.event
          : [parsedXml.web_service.event];

        // events.forEach((event) => {
        //   if (event.event_data) {
        //     const eventData = event.event_data;
        //     logger.info('Event Data:', { ...logContext, eventData });
        //     handleEvent(eventData);
        //   } else {
        //     logger.info('Event data not found in the event.', { ...logContext });
        //   }
        // });
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

async function handleEvent(tenantId, event) {
  // Extract common event properties
  const eventType = event['$'].type;
  const resourceId = event['$'].resource_id;
  const resourceType = event['$'].resource_type;

  const logContext = {
    tenantId, eventType, resourceId, resourceType,
  };
  logger.info('Handling event', { ...logContext, event });

  // Extract event data into a more accessible format
  let eventData = {};
  if (event.event_data) {
    eventData = event.event_data.reduce((acc, data) => {
      acc[data['$'].name] = data['$'].value;
      return acc;
    }, {});
  }

  let responseData = {};
  const call = {};
  switch (eventType) {
    case 'incoming':
      logger.info('Handling incoming event', { ...logContext, eventData });
      // Process incoming event here
      call.answer = 'yes';
      call.signaling = 'yes';
      responseData = await xmsRequests.updateCallRequest(tenantId, '', resourceId, call);
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
      responseData
      break;
    default:
      logger.warn('Unhandled event type', { ...logContext, eventType: event.type });
    // Handle unknown event type
  }

  logger.info('Event response', { ...logContext, responseData });
}

module.exports = router;
