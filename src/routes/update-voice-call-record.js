const express = require('express');

const logger = require('../utils/logger');
const common = require('../utils/common');
const cxRequests = require('../utils/cxengage-requests');
const errors = require('../utils/errors');
const sfRequests = require('../utils/sf-rest-requests');

const router = express.Router();

// Request type that we handle
const REQUEST_TYPE_OUT_BOUND_CALL = 'out-bound-call';
const REQUEST_TYPE_END_CALL = 'end-call';

/**
 * POST /update-voice-call-record API
 */
// eslint-disable-next-line no-unused-vars
router.post('/tenants/:tenantId/interactions/:interactionId/xms/update-voice-call-record', async (req, res, next) => {
  try {
    const {
      headers,
      method,
      url,
      params,
      body,
    } = req;

    logger.debug('/update-voice-call-record: headers:', headers);
    logger.debug('/update-voice-call-record: method:', method);
    logger.debug('/update-voice-call-record: params:', params);
    logger.debug('/update-voice-call-record: url:', url);
    logger.debug('/update-voice-call-record: body:', body);

    // Get the user id
    if (!Object.prototype.hasOwnProperty.call(headers, 'x-cx-auth-user-id')) {
      logger.error('/update-voice-call-record: missing parameter user id');
      common.sendHTTPError(res, {
        error: 'missing parameter user id',
      });
      return;
    }
    const cxUserId = headers['x-cx-auth-user-id'];
    logger.debug(`/update-voice-call-record: cxUserId: ${cxUserId}`);

    if (!common.validateUUID(cxUserId)) {
      logger.error('/update-voice-call-record: invalid CxEngage user id');
      common.sendHTTPError(res, {
        error: 'invalid CxEngage user id',
      });
      return;
    }

    // Get tenant and interaction id from the path url
    const {
      tenantId,
      interactionId,
    } = req.params;
    logger.debug(`/update-voice-call-record: tenantId: ${tenantId}`);
    logger.debug(`/update-voice-call-record: interactionId: ${interactionId}`);

    if (!common.validateUUID(tenantId)) {
      logger.error('/update-voice-call-record: invalid parameter tenant id');
      common.sendHTTPError(res, {
        error: 'invalid parameter tenant id',
      });
      return;
    }

    if (!common.validateUUID(interactionId)) {
      logger.error('/update-voice-call-record: invalid parameter interaction id');
      common.sendHTTPError(res, {
        error: 'invalid parameter interaction id',
      });
      return;
    }

    // Get the requestType from body
    if (!Object.prototype.hasOwnProperty.call(req.body, 'requestType')) {
      logger.error('/update-voice-call-record: missing parameter request type');
      common.sendHTTPError(res, {
        error: 'missing parameter extension type',
      });
      return;
    }

    const { requestType } = req.body;
    logger.debug(`/update-voice-call-record: requestType: ${requestType}`);

    // Validate request type
    if (requestType !== REQUEST_TYPE_OUT_BOUND_CALL
        && requestType !== REQUEST_TYPE_END_CALL) {
      logger.error('/update-voice-call-record: invalid request type: ', requestType);

      // We don't support this type
      common.sendHTTPError(res, {
        error: `invalid request type: ${requestType}`,
      });
      return;
    }

    // Get the sfVoiceCallId from body
    if (!Object.prototype.hasOwnProperty.call(req.body, 'sfVoiceCallId')) {
      logger.error('/update-voice-call-record: missing parameter xms voice call id');
      common.sendHTTPError(res, {
        error: 'missing parameter xms voice call id',
      });
      return;
    }

    const { sfVoiceCallId } = req.body;
    logger.debug(`/update-voice-call-record: sfVoiceCallId: ${sfVoiceCallId}`);

    // SF organization ID
    if (!Object.prototype.hasOwnProperty.call(req.body, 'sfOrganizationId')) {
      logger.error('/update-voice-call-record: missing parameter xms organization id');
      common.sendHTTPError(res, {
        error: 'missing parameter xms organization id',
      });
      return;
    }

    const { sfOrganizationId } = req.body;
    logger.debug(`/update-voice-call-record: sfOrganizationId: ${sfOrganizationId}`);

    // -----------------------------------------------------------------
    // Get the tenant, check if tenant is enabled
    const tenantPath = `tenants/${tenantId}`;
    const tenantRes = await cxRequests.getRequest(tenantPath);
    if (tenantRes.status > errors.STATUS_NO_ERROR) {
      logger.error('/update-voice-call-record: failed to get tenant details');
      common.sendHTTPError(res, {
        error: 'failed to get tenant details',
      });
      return;
    }
    const tenantDetails = tenantRes.body;
    logger.debug('/update-voice-call-record: tenantDetails: ', tenantDetails);

    // Tenant must be active
    if (!tenantDetails.active) {
      logger.error('/update-voice-call-record: tenant state is inactive');
      common.sendHTTPError(res, {
        error: 'tenant state is inactive',
      });
      return;
    }

    // ------------------------------------------------------------------
    // Validate interaction id, by calling get interaction
    const interactionPath = `tenants/${tenantId}/interactions/${interactionId}`;
    const interactionRes = await cxRequests.getRequest(interactionPath);
    if (interactionRes.status > errors.STATUS_NO_ERROR) {
      logger.error('/update-voice-call-record: failed to get interaction details');
      common.sendHTTPError(res, {
        error: 'failed to get interaction details',
      });
      return;
    }
    const interactionDetails = interactionRes.body;
    logger.debug('/update-voice-call-record: interactionDetails: ', interactionDetails);

    // -----------------------------------------------------------------
    // Get the SF integration
    const integrationPath = `tenants/${tenantId}/integrations`;
    logger.debug(`/update-voice-call-record: integrationPath: ${integrationPath}`);

    const integrationRes = await cxRequests.getRequest(integrationPath);
    if (integrationRes.status > errors.STATUS_NO_ERROR) {
      logger.error('/update-voice-call-record: failed to get tenant integrations');
      common.sendHTTPError(res, {
        error: 'failed to get tenant integrations',
      }, 500);
      return;
    }

    const integrations = integrationRes.body;
    logger.debug('/update-voice-call-record: integrations: ', integrations);

    const sfIntegration = common.getIntegration('xms', integrations, sfOrganizationId);
    if (!sfIntegration) {
      logger.error('/update-voice-call-record: XMS services integration not found for the provided organisation id');
      common.sendHTTPError(res, {
        error: 'XMS services integration not found for the provided organisation id',
      });
      return;
    }

    if (!sfIntegration.active) {
      logger.error('/update-voice-call-record: XMS services integration is not active');
      common.sendHTTPError(res, {
        error: 'error, XMS services integration is not active',
      });
      return;
    }

    const sfProperties = sfIntegration.properties;
    logger.debug('/update-voice-call-record: sfProperties: ', sfProperties);

    // ---------------------------------------------------------------
    // Call SF APIs
    logger.debug('/update-voice-call-record: Calling UpdateVoiceCall...');

    // ---------------------------
    // For Out Bound Call request
    if (requestType === REQUEST_TYPE_OUT_BOUND_CALL) {
      const payload = {
        isActiveCall: true,
        vendorCallKey: interactionId,
        callAttributes: JSON.stringify({
          byot_lifesize__CxEngage_Interaction_ID__c: interactionId,
          byot_lifesize__ResourceId__c: cxUserId,
        }),
      };
      logger.debug('/update-voice-call-record: payload: ', payload);

      // Call SF REST API
      const updateVoiceCallRes = await sfRequests.updateVoiceCallRecord(
        payload,
        sfVoiceCallId,
        sfProperties,
      );
      logger.debug('/update-voice-call-record: updateVoiceCallRes: ', updateVoiceCallRes);

      if (updateVoiceCallRes.status > errors.STATUS_NO_ERROR) {
        logger.error('/update-voice-call-record: failed to update');
        common.sendHTTPError(res, {
          error: 'failed to update xms voice call record',
        });
        return;
      }

      // Validate response
      if (!Object.prototype.hasOwnProperty.call(updateVoiceCallRes.body, 'status')) {
        logger.error('/update-voice-call-record: failed to update voice call record, invalid response');
        common.sendHTTPError(res, {
          error: 'failed to update voice call record, invalid response',
        });
        return;
      }

      if (updateVoiceCallRes.body.status !== 'Pending') {
        logger.error('/update-voice-call-record: failed status is not pending');
        common.sendHTTPError(res, {
          error: 'failed to update xms voice call record, status is not pending',
        });
        return;
      }

      common.sendHTTPSuccess(res, {
        status: 200,
        message: 'update voice call record successful, Out Bound Call',
      });

      logger.debug('/update-voice-call-record: UpdateVoiceCall Done - Out Bound Call');
      return;
    }

    // ---------------------------
    // For End Call request
    if (requestType === REQUEST_TYPE_END_CALL) {
      // Get the resource specific end timestamp
      if (!Object.prototype.hasOwnProperty.call(interactionDetails, 'agents')) {
        logger.error('/update-voice-call-record: agents object not found in interaction');
        common.sendHTTPError(res, {
          error: 'missing agent details in interaction',
        }, 500);
        return;
      }

      // Time stamp
      const timeStamp = getTimestamp(interactionDetails.agents, cxUserId);
      if (!timeStamp) {
        logger.error('/update-voice-call-record: failed to get required time stamp');
        common.sendHTTPError(res, {
          error: 'missing timestamp details in interaction',
        }, 500);
        return;
      }

      const payload = {
        startTime: timeStamp.startTimestamp,
        endTime: timeStamp.endTimestamp,
        isActiveCall: false,
        // from: 'TBD', // <-- Add this new filed with the tenant inbound number
        callAttributes: JSON.stringify({
          byot_lifesize__CxEngage_Interaction_ID__c: interactionId,
          byot_lifesize__ResourceId__c: cxUserId,
        }),
      };
      logger.debug('/update-voice-call-record: payload:', payload);

      // Call SF REST API
      const updateVoiceCallRes = await sfRequests.updateVoiceCallRecord(
        payload,
        sfVoiceCallId,
        sfProperties,
      );
      logger.debug('/update-voice-call-record: updating voiceCall record Response:', updateVoiceCallRes);

      if (updateVoiceCallRes.status > errors.STATUS_NO_ERROR) {
        logger.error('/update-voice-call-record: failed to update xms voice call record');
        common.sendHTTPError(res, {
          error: 'failed to update xms voice call record',
        });
        return;
      }

      // Validate response
      if (!Object.prototype.hasOwnProperty.call(updateVoiceCallRes.body, 'status')) {
        logger.error('/update-voice-call-record: failed to update voice call record, invalid response');
        common.sendHTTPError(res, {
          error: 'failed to update voice call record, invalid response',
        });
        return;
      }

      if (updateVoiceCallRes.body.status !== 'Pending') {
        logger.error('/update-voice-call-record: failed status is not pending');
        common.sendHTTPError(res, {
          error: 'failed to update xms voice call record, status is not pending',
        });
        return;
      }

      common.sendHTTPSuccess(res, {
        status: 200,
        message: 'update voice call record successful, End Call',
      });

      logger.debug('/update-voice-call-record: UpdateVoiceCall Done - End Call');
      return;
    }

    common.sendHTTPError(res, {
      error: 'Internal error, failed to update voice call record',
    });
  } catch (error) {
    logger.error('/update-voice-call-record: UpdateVoiceCall Catch Error: ', error);
    common.sendHTTPError(res, {
      error: 'internal error, failed to update voice call record',
    });
  }
});

/**
 * Extract the start and end timestamp from agent
 *
 * @param {array} agents Array of agent in interaction object
 * @param {string} cxUserId cx user id
 *
 * @returns Object { startTimestamp, endTimestamp }
 */
function getTimestamp(agents, cxUserId) {
  for (let index = 0; index < agents.length; index += 1) {
    if (agents[index].agentId === cxUserId) {
      const {
        startTimestamp,
        endTimestamp,
      } = agents[index];

      return {
        startTimestamp,
        endTimestamp,
      };
    }
  }
  return null;
}

module.exports = router;
