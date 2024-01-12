const axios = require('axios');
const uuid = require('uuid');
const JWT = require('jsonwebtoken');

const errors = require('./errors');
const logger = require('./logger');

const SF_TENANT_INFO_GRANT_TYPE = 'password';
const SF_TOKEN_EXPIRES_IN = '1h';
const SF_TOKEN_ALGORITHM = 'RS256';
const SF_TELEPHONY_API_POSTFIX = 'telephony/v1';

/**
 * Generate SF JWT token
 *
 * @param {string} sfProperties - CxEngage XMS services integration
 *
 * @returns JWT token
 */
function getJwtToken(sfProperties) {
  const signOptions = {
    issuer: sfProperties.organisationId,
    subject: sfProperties.callCenterName,
    expiresIn: SF_TOKEN_EXPIRES_IN,
    algorithm: SF_TOKEN_ALGORITHM,
    jwtid: uuid.v4(),
  };
  return JWT.sign({}, sfProperties.certificate, signOptions);
}

/**
 * Call SF voiceCalls REST API for creating new voice call.
 * This is the first step of PSR flow, this REST call will generate the PSR in SF service cloud.
 *
 * @param {string} extensionType - CX extension type
 * @param {string} sfProperties - CxEngage xms integration
 * @param {string} callTo - the tenant's inbound number
 * @param {string} callFrom - end customer's phone number
 * @param {string} interactionId - Cx call interaction id
 *
 * @returns
 */
async function postVoiceCall(
  extensionType,
  sfProperties,
  callTo,
  callFrom,
  interactionId,
  transfer,
  outboundTransfer,
) {
  logger.debug('SF-REST: postVoiceCall called...');

  const headers = {
    headers: {
      Authorization: `Bearer ${getJwtToken(sfProperties)}`,
      'Content-Type': 'application/json',
      'Telephony-Provider-Name': 'cxengaege-connector',
    },
  };
  logger.debug('SF-REST: postVoiceCall headers: ', headers);

  // For the transfer case of incoming call, we need to add a selector
  // So that SF can distinguish between two calls, we have same interaction id for both calls
  let transferSelect = '';
  if (transfer === 'cold-transfer' || transfer === 'warm-transfer') {
    transferSelect = `$$${Math.floor(new Date().getTime() / 1000)}`; // ## in the string is the selector
  }

  // If call is agent-initiated/outbound and transfer
  // Get the 'VendorCallKey'
  let vendorCallKey = null;
  if (outboundTransfer) {
    const vendorKeyResult = await getSfVendorCallKey(interactionId, sfProperties);
    if (vendorKeyResult.status > errors.STATUS_NO_ERROR) {
      logger.error('SF-REST: postVoiceCall: failed to get xms vendorCallKey');
      return {
        status: errors.HTTP_REQ_TO_SF_FAILED,
        body: {
          message: 'failed to get xms vendor key',
          error: vendorKeyResult.body,
        },
      };
    }

    const vendorKeyBody = vendorKeyResult.body;
    logger.debug('SF-REST: postVoiceCall vendorKeyBody:', vendorKeyBody);

    // Extract VendorCallKey
    if (vendorKeyBody.records.length <= 0) {
      return {
        status: errors.HTTP_REQ_TO_SF_FAILED,
        body: {
          message: 'failed to get xms vendor call key',
        },
      };
    }

    // As we have limited 1 record, we should get entry in first record
    vendorCallKey = vendorKeyBody.records[0].VendorCallKey;
    logger.debug(`SF-REST: postVoiceCall: vendorCallKey: ${vendorCallKey}`);
    if (!vendorKeyBody) {
      logger.error('SF-REST: postVoiceCall invalid vendorCallKey');
      return {
        status: errors.HTTP_REQ_TO_SF_FAILED,
        body: {
          message: 'invalid xms vendor call key',
        },
      };
    }
  }

  const payload = {
    callCenterApiName: sfProperties.callCenterName,
    initiationMethod: (transfer === 'new' ? 'Inbound' : 'Transfer'), // In case of 'Transfer', need to set parentVoiceCallId
    vendorCallKey: `${interactionId}${transferSelect}`,
    to: callTo,
    from: callFrom,
    startTime: new Date().toISOString(),
    participants: [{
      participantKey: callFrom,
      type: 'END_USER',
    }],
    callAttributes: `{"Channel_Type__c": "${extensionType}"}`,
  };
  logger.debug('SF-REST: postVoiceCall: payload: ', payload);

  // parentVoiceCallId in case of 'Transfer'
  if (transfer !== 'new') {
    if (vendorCallKey) {
      payload.parentVoiceCallId = vendorCallKey;
    } else {
      payload.parentVoiceCallId = interactionId;
    }
  }

  logger.debug('SF-REST: postVoiceCall: payload: ', payload);

  // Generate URL
  const baseURL = `${sfProperties.baseUrlTelephony}/${SF_TELEPHONY_API_POSTFIX}`;
  const URL = `${baseURL}/voiceCalls`;
  logger.debug(`SF-REST: postVoiceCall: URL: ${URL}`);

  try {
    const response = await axios.post(URL, payload, headers);
    logger.debug(`SF-REST: postVoiceCall API status: ${response.status}`);
    logger.debug('SF-REST: postVoiceCall API result Data: ', response.data);
    return {
      status: errors.STATUS_NO_ERROR,
      body: response.data,
    };
  } catch (error) {
    logger.error('SF-REST: postVoiceCall: Error: ', error.response.data);
    return {
      status: errors.HTTP_REQ_TO_SF_FAILED,
      body: error.response.data,
    };
  }
}

/**
 * Get the PSR object for the voice call ID from XMS services
 *
 * @param {string} sfProperties - CxEngage xms integration
 * @param {String} sfVoiceCallId - id of the SF voice call
 *
 * @returns
 */
async function getPSRRequest(sfProperties, sfVoiceCallId) {
  // Get the bearer token to call SF API
  const tokenReq = await getOauthToken(sfProperties);
  if (tokenReq.status > errors.STATUS_NO_ERROR) {
    return {
      status: errors.HTTP_REQ_TO_SF_FAILED,
      body: {
        error: tokenReq.body,
        message: 'failed to get valid xms token',
      },
    };
  }
  const token = tokenReq.body;

  const headers = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  // URL
  let URL = `${sfProperties.baseUrl}/services/data/v56.0/query/?q=SELECT Fields(ALL) `;
  URL += `FROM PendingServiceRouting Where WorkItemId='${sfVoiceCallId}' LIMIT 1`;
  logger.debug(`SF-REST: getPSRRequest URL: ${URL}`);

  try {
    const response = await axios.get(URL, headers);
    logger.debug(`SF-REST: getPSRRequest API status: ${response.status}`);
    return {
      status: errors.STATUS_NO_ERROR,
      body: response.data,
    };
  } catch (error) {
    logger.error('SF-REST: getPSRRequest API Error: ', error.response.data);
    return {
      status: errors.HTTP_REQ_TO_SF_FAILED,
      body: error.response.data,
    };
  }
}

/**
 * Create agent work in XMS services
 * based on the PSR details and SF agent id
 *
 * @param {object} sfProperties SF-BYOT integration
 * @param {string} serviceChannelId From PSF object
 * @param {string} voiceCallId Generated voice call id
 * @param {string} sfUserId xms user id
 * @param {string} psrId PSR id
 *
 * @returns
 */
async function createAgentWork(
  sfProperties, // SF-BYOT integration
  serviceChannelId, // From PSF object
  voiceCallId, // Generated voice call id
  sfUserId, // xms user id
  psrId, // PSR id
) {
  logger.debug('SF-REST: createAgentWork called');

  // Get the bearer token to call SF API
  const tokenReq = await getOauthToken(sfProperties);
  if (tokenReq.status > errors.STATUS_NO_ERROR) {
    return {
      status: errors.HTTP_REQ_TO_SF_FAILED,
      body: {
        error: tokenReq.body,
        message: 'failed to get valid xms token',
      },
    };
  }
  const token = tokenReq.body;

  const headers = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  const payload = {
    ServiceChannelId: serviceChannelId,
    WorkItemId: voiceCallId,
    UserId: sfUserId,
    PendingServiceRoutingId: psrId,
  };
  logger.debug('SF-REST: createAgentWork payload: ', payload);

  const URL = `${sfProperties.baseUrl}/services/data/v56.0/sobjects/AgentWork`;
  logger.debug(`SF-REST: createAgentWork URL: ${URL}`);

  try {
    const response = await axios.post(URL, payload, headers);
    logger.debug(`SF-REST: createAgentWork API status: ${response.status}`);

    return {
      status: errors.STATUS_NO_ERROR,
      body: response.data,
    };
  } catch (error) {
    logger.error('SF-REST: createAgentWork API Error: ', error.response.data);
    return {
      status: errors.HTTP_REQ_TO_SF_FAILED,
      body: error.response.data,
    };
  }
}

/**
 * Get XMS services Oauth token
 *
 * @param {string} sfProperties - CxEngage xms integration
 *
 * @returns XMS services Oauth token in case of success else error object
 */
async function getOauthToken(sfProperties) {
  logger.debug('SF-REST: getOauthToken called...');
  const headers = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  // Generate URI encoded payload
  const payload = new URLSearchParams();
  payload.append('username', sfProperties.username); // SF_TENANT_INFO_USERNAME
  payload.append('password', `${sfProperties.password}${sfProperties.securityToken}`); // SF_TENANT_INFO_PASSWORD
  payload.append('grant_type', SF_TENANT_INFO_GRANT_TYPE);
  payload.append('client_id', sfProperties.consumerKey); // SF_TENANT_INFO_CLIENT_ID
  payload.append('client_secret', sfProperties.consumerSecret); // SF_TENANT_INFO_CLIENT_SECRET
  // logger.debug('SF-REST: getOauthToken: payload: ', payload.toString());

  // Path
  const URL = `${sfProperties.baseUrl}/services/oauth2/token`;
  // logger.debug('SF-REST: getOauthToken: URL: ', URL);

  try {
    const response = await axios.post(URL, payload, headers);
    logger.debug('SF-REST: getOauthToken API status: ', response.status);

    // Store access token
    const sfOauthAccessToken = response.data.access_token;

    return {
      status: errors.STATUS_NO_ERROR,
      body: sfOauthAccessToken,
    };
  } catch (error) {
    logger.error('SF-REST: getOauthToken API Error: ', error.response.data);
    return {
      status: errors.HTTP_REQ_TO_SF_FAILED,
      body: error.response.data,
    };
  }
}

/**
 * Update SF voiceCalls record.
 *
 * @param {string} payload
 * @param {string} sfProperties - CxEngage xms integration
 *
 * @returns
 */
async function updateVoiceCallRecord(
  payload,
  sfVoiceCallId,
  sfProperties,
) {
  logger.debug('SF-REST: updateVoiceCallRecord called...');

  const headers = {
    headers: {
      Authorization: `Bearer ${getJwtToken(sfProperties)}`,
      'Content-Type': 'application/json',
      'Telephony-Provider-Name': 'cxengaege-connector',
    },
  };
  logger.debug('SF-REST: updateVoiceCallRecord: headers: ', headers.headers);

  // Generate URL
  const baseURL = `${sfProperties.baseUrlTelephony}/${SF_TELEPHONY_API_POSTFIX}`;
  const URL = `${baseURL}/voiceCalls/${sfVoiceCallId}`;
  logger.debug(`SF-REST: updateVoiceCallRecord: URL: ${URL}`);

  try {
    const response = await axios.patch(URL, payload, headers);
    logger.debug(`SF-REST: updateVoiceCallRecord API status: ${response.status}`);
    return {
      status: errors.STATUS_NO_ERROR,
      body: response.data,
    };
  } catch (error) {
    logger.error('SF-REST: updateVoiceCallRecord: Error: ', error.response);
    return {
      status: errors.HTTP_REQ_TO_SF_FAILED,
      body: error.response.data,
    };
  }
}

/**
 * Get SF VendorCallKey.
 *
 * @param {string} payload
 * @param {string} sfProperties - CxEngage xms integration
 *
 * @returns
 */
async function getSfVendorCallKey(
  interactionId,
  sfProperties,
) {
  logger.debug('SF-REST: getSfVendorCallKey called...');

  // Get the bearer token to call SF API
  const tokenReq = await getOauthToken(sfProperties);
  if (tokenReq.status > errors.STATUS_NO_ERROR) {
    return {
      status: errors.HTTP_REQ_TO_SF_FAILED,
      body: {
        error: tokenReq.body,
        message: 'failed to get valid xms token',
      },
    };
  }
  const token = tokenReq.body;

  const headers = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // URL
  let URL = `${sfProperties.baseUrl}/services/data/v56.0/query/?q=SELECT VendorCallKey FROM VoiceCall`;
  URL += ` Where byot_lifesize__CxEngage_Interaction_ID__c='${interactionId}'`;
  URL += ' and callType=\'Outbound\' LIMIT 1';
  logger.debug(`SF-REST: getPSRRequest URL: ${URL}`);

  try {
    const response = await axios.get(URL, headers);
    logger.debug(`SF-REST: getSfVendorCallKey API status: ${response.status}`);
    return {
      status: errors.STATUS_NO_ERROR,
      body: response.data,
    };
  } catch (error) {
    logger.error('SF-REST: getSfVendorCallKey: Error: ', error.response);
    return {
      status: errors.HTTP_REQ_TO_SF_FAILED,
      body: error.response.data,
    };
  }
}

module.exports = {
  postVoiceCall,
  getPSRRequest,
  getOauthToken,
  createAgentWork,
  updateVoiceCallRecord,
};
