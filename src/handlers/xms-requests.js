const axios = require('axios');
const xml2js = require('xml2js');
const logger = require('../utils/logger');
const errors = require('../utils/errors');

// const xmsUrl = 'http://10.212.44.102:81';
const xmsUrl = 'http://107.20.26.214:81';
const username = 'APITest';
const password = 'ApiTest123!@#';
const token = Buffer.from(`${username}:${password}`, 'utf8').toString('base64');

async function updateXMSRequest(path, payload) {
  let updatedPath = path;
  if (!updatedPath.startsWith('/')) {
    updatedPath = `/${updatedPath}`;
  }

  const url = `${xmsUrl}${updatedPath}?appid=app`;
  logger.debug('Calling xms call services', { url, payload });

  const headers = {
    'Content-Type': 'application/xml',
    Authorization: `Basic ${token}`,
  };

  try {
    const response = await axios.put(url, payload, { headers });
    logger.debug('updateCallRequest, xms /call response:', { response: response.data });
    // Parse the XML response using xml2js
    const parser = new xml2js.Parser();
    // const parsedData = await parser.parseStringPromise(response.data);
    const parsedData = await new Promise((resolve, reject) => {
      parser.parseString(response.data, (err, result) => {
        if (err) {
          reject(err);
        } else {
          logger.debug('Passing out the xml data from payload: result:', JSON.stringify(result)); // 打印出 result
          resolve(result);
        }
      });
    });
    return {
      status: errors.STATUS_NO_ERROR,
      body: parsedData,
    };
  } catch (error) {
    logger.error('Failed to update xms call:', error);
    throw new Error({
      status: errors.FAILED_SEND_REQUEST_TO_XMS,
      body: {
        message: 'Failed to update the XMS /call request.',
        error,
      },
    });
  }
}

function createWebHookRequest(tenantId, interactionId, webhookUrl) {
  const xmsurl = `${xmsUrl}/default/eventhandlers?tag=remotecontrol_;appid=app`;

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

// Get all eventhandlers from xms server
async function getEventHandlersRequest() {
  const xmsurl = `${xmsUrl}/default/eventhandlers?appid=app`;

  logger.info('getEventHandlersRequest, xmsurl:', xmsurl);

  try {
    const response = await axios.get(xmsurl, {
      headers: {
        Authorization: `Basic ${token}`,
      },
    });
    const xmlData = response.data;
    const parser = new xml2js.Parser();
    const jsonData = await parser.parseStringPromise(xmlData);
    logger.debug('getEventHandlersRequest, jsonData:', jsonData);
    return jsonData;
  } catch (error) {
    logger.error('Failed to get event handlers:', error);
    throw errors.createError('Failed to get event handlers', error);
  }
}

async function createCallRequest(tenantId, interactionId, source, destination) {
  const xmsurl = `${xmsUrl}/default/calls?appid=app`;

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
          signaling: 'yes',
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

  logger.debug(`Calling xms call services to dail ${destination}}`, { ...logContext, xmsurl, xml });

  try {
    const res = await axios.post(xmsurl, xml, {
      headers: {
        'Content-Type': 'application/xml',
        Authorization: `Basic ${token}`,
      },
    });
    return new Promise((resolve, reject) => {
      xml2js.parseString(res.data, (err, result) => {
        if (err) {
          logger.error('Failed to create xms called:', err);
          reject(err);
        } else {
          logger.debug('CreatecallRequest, xms /call response:', JSON.stringify(result));
          resolve({
            status: errors.STATUS_NO_ERROR,
            body: result,
          });
        }
      });
    });
  } catch (err) {
    logger.error('getRequest Errors:', err);
    return {
      status: errors.FAILED_SEND_REQUEST_TO_XMS,
      body: {
        message: 'Failed to call the XMS /call request.',
        error: err,
      },
    };
  }
}

// Update the call to the xms server.
// The call will be updated with the provided XML payload.
async function updateCallRequest(tenantId, interactionId, callId, call) {
  const path = `/default/calls/${callId}`;

  const logContext = {
    tenantId,
    interactionId,
    callId,
    call,
  };

  const obj = {
    web_service: {
      $: {
        version: '1.0',
      },
      call: {
        $: {
          answer: call.answer || 'yes',
          async_completion: call.async_completion || 'yes',
          async_dtmf: call.async_dtmf || 'yes',
          async_tone: call.async_tone || 'yes',
          cpa: call.cpa || 'no',
          dtmf_mode: call.dtmf_mode || 'rfc2833',
          info_ack_mode: call.info_ack_mode || 'automatic',
          media: call.media || 'audio',
          signaling: call.signaling || 'yes',
          rx_delta: '+0dB',
          tx_delta: '+0dB',
        },
      },
    },
  };

  const builder = new xml2js.Builder();
  const xml = builder.buildObject(obj);

  logger.debug('Calling xms call services', { ...logContext, path, xml });

  try {
    const response = await updateXMSRequest(path, xml);
    logger.debug('updateCallRequest, xms /call response:', { ...logContext, response });
    return response.body;
  } catch (error) {
    logger.error(`Failed to update xms call: ${error}`);
    return {
      status: errors.FAILED_SEND_REQUEST_TO_XMS,
      body: {
        message: 'Failed to update the XMS /call request.',
        error,
      },
    };
  }
}

/**
 * Delete the call from the xms server.
 */
async function deleteCallRequest(tenantId, interactionId, callId) {
  const path = `/default/calls/${callId}`;
  const xmsurl = `${xmsUrl}${path}?appid=app`;

  const logContext = {
    tenantId,
    interactionId,
    callId,
  };

  logger.debug('Calling xms  services to delete the call', { ...logContext, xmsurl });

  try {
    const response = await axios.delete(xmsurl, {
      headers: {
        Authorization: `Basic ${token}`,
      },
    });
    logger.debug('deleteCallRequest, xms /call response:', { ...logContext, response });
    return {
      status: errors.STATUS_NO_ERROR,
      body: response.data,
    };
  } catch (error) {
    logger.error('Failed to delete xms call:', error);
    return {
      status: errors.FAILED_SEND_REQUEST_TO_XMS,
      body: {
        message: 'Failed to delete the XMS /call request.',
        error,
      },
    };
  }
}

/**
 * Play media to the call
 */
async function playMediaRequest(tenantId, interactionId, callId, callData) {
  const path = `/default/calls/${callId}`;

  const logContext = {
    tenantId,
    interactionId,
    callId,
    callData,
  };

  const obj = {
    web_service: {
      $: { version: '1.0' },
      call: {
        call_action: callData,
      },
    },
  };
  const builder = new xml2js.Builder();
  const xml = builder.buildObject(obj);

  logger.debug('Calling xms call services to play media', { ...logContext, path, xml });

  try {
    const response = await updateXMSRequest(path, xml);
    logger.debug('updateCallRequest is called, xms response:', { ...logContext, response });
    return response.body;
  } catch (error) {
    logger.error('Failed to update xms call: ', error);
    throw error;
    // return {
    //   status: errors.FAILED_SEND_REQUEST_TO_XMS,
    //   body: {
    //     message: 'Failed to update the XMS /call request.',
    //     error,
    //   },
    // };
  }
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

async function createConferenceRequest(tenantId, interactionId, conferenceParams) {
  const xmsurl = `${xmsUrl}/default/conferences?appid=app`;

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

  try {
    const res = await axios.post(xmsurl, xml, {
      headers: {
        'Content-Type': 'application/xml',
        Authorization: `Basic ${token}`,
      },
    });

    return new Promise((resolve, reject) => {
      xml2js.parseString(res.data, (err, result) => {
        if (err) {
          reject(err);
        } else {
          logger.debug('CreateConferenceRequest, xms /conference response:', JSON.stringify(result));
          resolve({
            status: errors.STATUS_NO_ERROR,
            body: result,
          });
        }
      });
    });
  } catch (err) {
    logger.error('getRequest Errors:', err);
    return {
      status: errors.FAILED_SEND_REQUEST_TO_XMS,
      body: {
        message: 'Failed to call the XMS /conference request.',
        error: err,
      },
    };
  }
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
async function updateConferenceRequest(tenantId, interactionId, conferenceId, updateParams) {
  const xmsurl = `${xmsUrl}/default/conferences?appid=app`;

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

async function addCallToConferenceRequest(tenantId, interactionId, conferenceId, callId) {
  const xmsurl = `${xmsUrl}/default/calls/${callId}?appid=app`;

  const logContext = {
    tenantId,
    interactionId,
    conferenceId,
    callId,
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
              audio: 'sendrecv',
              auto_gain_control: 'yes',
              clamp_dtmf: 'no',
              conf_id: conferenceId,
              echo_cancellation: 'yes',
              region: '0',
              video: 'inactive',
            },
          },
        },
      },
    },
  };

  const builder = new xml2js.Builder();
  const xml = builder.buildObject(obj);

  logger.debug('Calling xms conference services', { ...logContext, xmsurl, xml });

  try {
    const res = await axios.put(xmsurl, xml, {
      headers: {
        'Content-Type': 'application/xml',
        Authorization: `Basic ${token}`,
      },
    });

    return new Promise((resolve, reject) => {
      xml2js.parseString(res.data, (err, result) => {
        if (err) {
          reject(err);
        } else {
          logger.debug('addCallToConferenceRequest, xms /conference response:', JSON.stringify(result));
          resolve({
            status: errors.STATUS_NO_ERROR,
            body: result,
          });
        }
      });
    });
  } catch (err) {
    logger.error('addCallToConferenceRequest() get error in the request, Errors:', err);
    return {
      status: errors.FAILED_SEND_REQUEST_TO_XMS,
      body: {
        message: 'Failed to call the XMS /conference request.',
        error: err,
      },
    };
  }
}

module.exports = {
  getEventHandlersRequest,
  createWebHookRequest,
  createConferenceRequest,
  createCallRequest,
  updateConferenceRequest,
  updateCallRequest,
  playMediaRequest,
  deleteCallRequest,
  addCallToConferenceRequest,
};
