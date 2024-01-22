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

//   const data = `<?xml version="1.0" encoding="UTF-8" ?>
// <web_service
//     version="1.0">
//     <eventhandler>
//         <eventsubscribe
//             action="add"
//             resource_id="any"
//             resource_type="any"
//             type="any"/>
//         <webhooks
//             action="add"
//             url="https://efa2-159-2-180-142.ngrok-free.app/webhook/tenant/c76c67ef-0ca9-4f52-854b-8d5cc2ee3cfb/interaction/2475a9e3-4364-4f1a-8d41-51705f15aca9"/>
//     </eventhandler>
// </web_service>`;

  return axios.post(xmsurl, xml, {
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
          message: 'Failed to call xms to create webhook.',
          error: err,
        },
      };
    });
}

function createCallRequest(tenantId, interactionId, source, destination) {
  const xmsurl = `${xmsUrl}/default/calls?appid=${tenantId}`;

  const logContext = {
    tenantId,
    interactionId,
    source,
    destination,
  };

  const obj = {
    web_service: {
      $: {
        version: '1.0',
      },
      call: {
        $: {
          async_dtmf: 'yes',
          async_tone: 'yes',
          audio: 'sendrecv',
          cpa: 'no',
          destination_uri: destination,
          dtmf_mode: 'rfc2833',
          ice: 'no',
          info_ack_mode: 'automatic',
          media: 'audio',
          signaling: 'no',
          source_uri: source,
          rx_delta: '+0dB',
          tx_delta: '+0dB',
          video: 'sendrecv',
        },
      },
    },
  };

  const builder = new xml2js.Builder();
  const xml = builder.buildObject(obj);

  logger.debug('Calling xms call services', { ...logContext, xmsurl, xml });

  const response = axios.post(xmsurl, xml, {
    headers: {
      'Content-Type': 'application/xml',
      Authorization: `Basic ${token}`,
    },
  })
    .then((res) => new Promise((resolve, reject) => {
      xml2js.parseString(res.data, (err, result) => {
        if (err) {
          reject(err);
        } else {
          logger.debug('createCallRequest, xms /call response:', JSON.stringify(JSON.parse(result)));
          resolve({
            status: errors.STATUS_NO_ERROR,
            body: JSON.parse(result),
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
          message: 'Failed to call the XMS /call request.',
          error: err,
        },
      };
    });

  logger.debug('createCallRequest: response:', response);
  return response;
}

// Create a coference request to xms server to create a conference. The conference will
// be created with the following xml format:
// <web_service
// version="1.0">
// <conference
//     active_talker_interval="0ms"
//     active_talker_region="1"
//     auto_gain_control="yes"
//     beep="yes"
//     caption="yes"
//     caption_duration="infinite"
//     clamp_dtmf="no"
//     echo_cancellation="yes"
//     layout="0"
//     layout_size="vga"
//     max_parties="2"
//     mixing_mode="mcu"
//     reserve="2"
//     type="audio"/>
// </web_service>
function createConferenceRequest(tenantId, interactionId, conferenceParams) {
  const xmsurl = `${xmsUrl}/default/conferences?appid=${tenantId}`;

  const logContext = {
    tenantId,
    interactionId,
    conferenceParams,
  };

  const obj = {
    web_service: {
      $: {
        version: '1.0',
      },
      conference: {
        $: {
          active_talker_interval: conferenceParams.active_talker_interval || '0ms',
          active_talker_region: conferenceParams.active_talker_region || '1',
          auto_gain_control: conferenceParams.auto_gain_control || 'yes',
          beep: conferenceParams.beep || 'yes',
          caption: conferenceParams.caption || 'yes',
          caption_duration: conferenceParams.caption_duration || 'infinite',
          clamp_dtmf: conferenceParams.clamp_dtmf || 'no',
          echo_cancellation: conferenceParams.echo_cancellation || 'yes',
          layout: conferenceParams.layout || '0',
          layout_size: conferenceParams.layout_size || 'vga',
          max_parties: conferenceParams.max_parties || '4',
          mixing_mode: conferenceParams.mixing_mode || 'mcu',
          reserve: conferenceParams.reserve || '2',
          type: conferenceParams.type || 'audio',
        },
      },
    },
  };

  const builder = new xml2js.Builder();
  const xml = builder.buildObject(obj);

  logger.debug('Calling xms conference services', { ...logContext, xmsurl, xml });

  const response = axios.post(xmsurl, xml, {
    headers: {
      'Content-Type': 'application/xml',
      Authorization: `Basic ${token}`,
    },
  })
    .then((res) => new Promise((resolve, reject) => {
      xml2js.parseString(res.data, (err, result) => {
        if (err) {
          reject(err);
        } else {
          logger.debug('createConferenceRequest, xms /conference response:', JSON.stringify(JSON.parse(result)));
          resolve({
            status: errors.STATUS_NO_ERROR,
            body: JSON.parse(result),
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
          message: 'Failed to call the XMS /conference request.',
          error: err,
        },
      };
    });

  logger.debug('createConferenceRequest: response:', response);
  return response;
}

// Update the conference to the xms server.
// The conference will be updated with the following xml format:
// <web_service
// version="1.0">
// <call>
//     <call_action>
//         <add_party
//             audio="sendrecv"
//             auto_gain_control="yes"
//             clamp_dtmf="no"
//             conf_id="ae4435c4-6e1a-4bbf-a6e0-133d3cb4b2d8"
//             echo_cancellation="yes"
//             region="0"
//             video="inactive"/>
//         </call_action>
//     </call>
// </web_service>
function updateConferenceRequest(tenantId, interactionId, conferenceId, updateParams) {
  const xmsurl = `${xmsUrl}/default/conferences?appid=${tenantId}`;

  const logContext = {
    tenantId,
    interactionId,
    conferenceId,
    updateParams,
  };

  const obj = {
    web_service: {
      $: {
        version: '1.0',
      },
      call: {
        call_action: {
          add_party: {
            $: {
              audio: updateParams.audio || 'sendrecv',
              auto_gain_control: updateParams.auto_gain_control || 'yes',
              clamp_dtmf: updateParams.clamp_dtmf || 'no',
              conf_id: conferenceId,
              echo_cancellation: updateParams.echo_cancellation || 'yes',
              region: updateParams.region || '0',
              video: updateParams.video || 'inactive',
            },
          },
        },
      },
    },
  };

  const builder = new xml2js.Builder();
  const xml = builder.buildObject(obj);

  logger.debug('Calling xms conference services', { ...logContext, xmsurl, xml });

  const response = axios.put(xmsurl, xml, {
    headers: {
      'Content-Type': 'application/xml',
      Authorization: `Basic ${token}`,
    },
  })
    .then((res) => new Promise((resolve, reject) => {
      xml2js.parseString(res.data, (err, result) => {
        if (err) {
          reject(err);
        } else {
          logger.debug('updateConferenceRequest, xms /conference response:', JSON.stringify(JSON.parse(result)));
          resolve({
            status: errors.STATUS_NO_ERROR,
            body: JSON.parse(result),
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
          message: 'Failed to call the XMS /conference request.',
          error: err,
        },
      };
    });

  logger.debug('updateConferenceRequest: response:', response);
  return response;
}

module.exports = {
  createWebHookRequest,
  createConferenceRequest,
  createCallRequest,
  updateConferenceRequest,
};
