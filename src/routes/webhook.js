const express = require('express');

const xml2js = require('xml2js');
const logger = require('../utils/logger');
const common = require('../utils/common');
const AWS = require('aws-sdk');
const { log } = require('winston');

function parseXml(xml) {
  return xml2js.parseStringPromise(xml, { explicitArray: false })
    .then((result) => {
      if (result.web_service && result.web_service.event && result.web_service.event.event_data) {
        const eventDataArray = result.web_service.event.event_data;
        const eventDataObject = {};
        eventDataArray.forEach((item) => {
          eventDataObject[item.$.name] = item.$.value;
        });
        const newResult = JSON.parse(JSON.stringify(result));
        newResult.web_service.event.event_data = eventDataObject;
        return newResult;
      }
      return result;
    });
}

const router = express.Router();

router.post('/webhook/tenant/:tenantId/interaction/:interactionId', (req, res) => {
  // 你的 webhook 逻辑在这里
  // 你可以从 req.body 中获取 POST 请求的数据
  const { body, params } = req;
  const { tenantId, interactionId } = params;

  const inputParams = {
    tenantId,
    interactionId,
    body,
  };

  logger.info('/webhook: called', inputParams);

  if (!body || Object.keys(body).length === 0) {
    common.sendHTTPSuccess(res, {
      status: 200,
      message: 'webhook checked',
    });
    return;
  }

  const xmsData = parseXml(body);
  logger.info('xms webhook recevied:', xmsData);

  common.sendHTTPSuccess(res, {
    status: 200,
    message: 'verify-webhook Done',
  });
});

module.exports = router;
