const axios = require('axios');
const xml2js = require('xml2js');
const logger = require('./logger');
const errors = require('./errors');

const xmsUrl = 'http://10.212.44.102:81';
const username = 'bliao';
const password = 'Password123!@#';
const token = Buffer.from(`${username}:${password}`, 'utf8').toString('base64');

function createWebHookRequest(tenantId, interactionId, webhookUrl) {
  const xmsurl = `${xmsUrl}/default/eventhandlers?tag=remotecontrol_;appid=${tenantId}`;

  const obj = {
    web_service: {
      $: {
        version: '1.0',
      },
      eventhandler: {
        eventsubscribe: {
          $: {
            action: 'add',
            resource_id: 'any',
            resource_type: 'any',
            type: 'any',
          },
        },
        webhooks: {
          $: {
            action: 'add',
            url: webhookUrl,
          },
        },
      },
    },
  };

  const builder = new xml2js.Builder();
  const xml = builder.buildObject(obj);

  logger.debug('Create a webhook request, token:', token);
  logger.debug('Create a webhook request, body:', xml);
  logger.debug('Create a webhook request, xmsurl:', xmsurl);

  const data = `<?xml version="1.0" encoding="UTF-8" ?>
<web_service
    version="1.0">
    <eventhandler>
        <eventsubscribe
            action="add"
            resource_id="any"
            resource_type="any"
            type="any"/>
        <webhooks
            action="add"
            url="https://efa2-159-2-180-142.ngrok-free.app/webhook/tenant/c76c67ef-0ca9-4f52-854b-8d5cc2ee3cfb/interaction/2475a9e3-4364-4f1a-8d41-51705f15aca9"/>
    </eventhandler>
</web_service>`;

  return axios.post(xmsurl, data, {
    headers: {
      'Content-Type': 'application/xml',
      Authorization: `Basic ${token}`,
    },
  })
    .then((response) => new Promise((resolve, reject) => {
      xml2js.parseString(response.data, (err, result) => {
        if (err) {
          reject(err);
        } else {
          logger.debug('createWebHookRequest: result:', JSON.stringify(result)); // 打印出 result
          resolve({
            status: errors.STATUS_NO_ERROR,
            body: result,
          });
        }
      });
    }))
    .catch((err) => {
    // Handle error
      logger.error('getRequest Errors:', err);
      return {
        status: errors.FAILED_SEND_REQUEST_TO_XMS,
        body: {
          message: 'failed, http get request',
          error: err.response.data,
        },
      };
    });
}

module.exports = {
  createWebHookRequest,
};
