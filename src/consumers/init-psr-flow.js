const express = require('express');
const logger = require('../utils/logger');

const common = require('../utils/common');
const cxRequests = require('../handlers/cxengage-requests');
const errors = require('../utils/errors');
const sfRequests = require('../utils/sf-rest-requests');

const router = express.Router({ mergeParams: true });

// Number of times we will try to get PSR from xms
const SF_GET_PSR_RETRY_COUNT = 3;

// Delay between each get PSR request
const SF_GET_PSR_RETRY_DELAY_MS = 500;

/* POST init-psr-flow API */
// eslint-disable-next-line no-unused-vars
router.post('/tenants/:tenantId/users/:userId/xms/init-psr-flow', async (req, res, next) => {
  try {
    const {
      headers,
      method,
      url,
      params,
      body,
    } = req;

    logger.debug('/init-psr-flow: headers:', headers);
    logger.debug('/init-psr-flow: method:', method);
    logger.debug('/init-psr-flow: params:', params);
    logger.debug('/init-psr-flow: url:', url);
    logger.debug('/init-psr-flow: body:', body);

    // -------------------------------------------------------------------------------------
    // #1 Validate -------------------------------------------------------------------------

    // Extract cx user id and tenant id from url
    const {
      userId: cxUserId,
      tenantId,
    } = req.params;
    logger.debug(`/init-psr-flow: cxUserId: ${cxUserId}`);
    logger.debug(`/init-psr-flow: tenantId: ${tenantId}`);

    if (!common.validateUUID(cxUserId)) {
      logger.error('/init-psr-flow: invalid parameter user id');
      common.sendHTTPError(res, {
        error: 'invalid parameter user id',
      });
      return;
    }

    if (!common.validateUUID(tenantId)) {
      logger.error('/init-psr-flow: invalid parameter tenant id');
      common.sendHTTPError(res, {
        error: 'invalid parameter tenant id',
      });
      return;
    }

    // Transfer Type
    if (!Object.prototype.hasOwnProperty.call(req.body, 'transfer')) {
      logger.error('/init-psr-flow: missing parameter transfer type');
      common.sendHTTPError(res, {
        error: 'missing parameter transfer type',
      });
      return;
    }
    const { transfer } = req.body;
    logger.debug(`/init-psr-flow: transfer: ${transfer}`); // warm-transfer, cold-transfer or new

    // Extract outboundTransfer - True if If call is outgoing and transfer call
    if (!Object.prototype.hasOwnProperty.call(req.body, 'outboundTransfer')) {
      logger.error('/init-psr-flow: missing parameter outbound transfer type');
      common.sendHTTPError(res, {
        error: 'missing parameter outbound transfer type',
      });
      return;
    }
    const { outboundTransfer } = req.body;
    logger.debug(`/init-psr-flow: outboundTransfer: ${outboundTransfer}`);

    // Extension Type
    if (!Object.prototype.hasOwnProperty.call(req.body, 'extensionType')) {
      logger.error('/init-psr-flow: missing parameter extension type');
      common.sendHTTPError(res, {
        error: 'missing parameter extension type',
      });
      return;
    }
    const { extensionType } = req.body;
    logger.debug(`/init-psr-flow: extensionType: ${extensionType}`);

    // xms user ID
    if (!Object.prototype.hasOwnProperty.call(req.body, 'sfUserId')) {
      logger.error('/init-psr-flow: missing parameter xms user id');
      common.sendHTTPError(res, {
        error: 'missing parameter xms user id',
      });
      return;
    }
    const { sfUserId } = req.body;
    logger.debug(`/init-psr-flow: sfUserId: ${sfUserId}`);

    // Interaction ID
    if (!Object.prototype.hasOwnProperty.call(req.body, 'interactionId')) {
      logger.error('/init-psr-flow: missing parameter interaction id');
      common.sendHTTPError(res, {
        error: 'missing parameter interaction id',
      });
      return;
    }

    const { interactionId } = req.body;
    logger.debug(`/init-psr-flow: interactionId: ${interactionId}`);
    if (!common.validateUUID(interactionId)) {
      logger.error('/init-psr-flow: invalid parameter interaction id');
      common.sendHTTPError(res, {
        error: 'invalid parameter interaction id',
      });
      return;
    }

    // xms organization ID
    if (!Object.prototype.hasOwnProperty.call(req.body, 'sfOrganizationId')) {
      logger.error('/init-psr-flow: missing parameter xms organization id');
      common.sendHTTPError(res, {
        error: 'missing parameter xms organization id',
      });
      return;
    }

    const { sfOrganizationId } = req.body;
    logger.debug(`/init-psr-flow: sfOrganizationId: ${sfOrganizationId}`);

    // -------------------------------------------------------------------------------------
    // #2 ----------------------------------------------------------------------------------

    // Get the tenant, check if tenant is enabled
    const tenantPath = `tenants/${tenantId}`;
    const tenantRes = await cxRequests.getRequest(tenantPath);
    if (tenantRes.status > errors.STATUS_NO_ERROR) {
      logger.error('/init-psr-flow: failed to get tenant details');
      common.sendHTTPError(res, {
        error: 'failed to get tenant details',
      }, 500);
      return;
    }
    const tenantDetails = tenantRes.body;
    logger.debug('/init-psr-flow: tenantDetails: ', tenantDetails);

    // Tenant must be active
    if (!tenantDetails.active) {
      logger.debug('/init-psr-flow: CX tenant is not active');
      common.sendHTTPError(res, {
        error: 'tenant state is inactive',
      }, 500);
      return;
    }

    // Get the tenant/user, check if user is enabled
    const userPath = `tenants/${tenantId}/users/${cxUserId}`;
    const userRes = await cxRequests.getRequest(userPath);
    if (userRes.status > errors.STATUS_NO_ERROR) {
      logger.error('/init-psr-flow: failed to get CxEngage user details');
      common.sendHTTPError(res, {
        error: 'failed to get CxEngage user details',
      }, 500);
      return;
    }

    const userDetails = userRes.body;
    logger.debug('/init-psr-flow: userDetails: ', userDetails);

    // Check if user is enabled for tenant
    let userEnabled = false;
    if (userDetails.platformStatus === 'enabled'
      && userDetails.status === 'accepted') {
      userEnabled = true;
    }

    logger.debug(`/init-psr-flow: userEnabled: ${userEnabled}`);
    if (!userEnabled) {
      common.sendHTTPError(res, {
        error: 'CxEngage user account is inactive',
      }, 500);
      return;
    }

    // Get the tenant/interactions
    const interactionPath = `tenants/${tenantId}/interactions/${interactionId}`;
    logger.debug('/init-psr-flow: interactionPath: ', interactionPath);

    const interactionRes = await cxRequests.getRequest(interactionPath);
    if (interactionRes.status > errors.STATUS_NO_ERROR) {
      logger.error('/init-psr-flow: failed to get interaction details');
      common.sendHTTPError(res, {
        error: 'failed to get interaction details',
      }, 500);
      return;
    }
    const interactionDetails = interactionRes.body;
    logger.debug('/init-psr-flow: interactionDetails: ', interactionDetails);

    // -------------------------------------------------------------------------------------
    // #3 ----------------------------------------------------------------------------------

    // -----------------------------------------------------------------
    // Get the xms integration
    const integrationPath = `tenants/${tenantId}/integrations`;
    logger.debug(`/init-psr-flow: integrationPath: ${integrationPath}`);

    const integrationRes = await cxRequests.getRequest(integrationPath);
    logger.debug('/init-psr-flow: integrationRes: ', integrationRes);

    if (integrationRes.status > errors.STATUS_NO_ERROR) {
      logger.error('/init-psr-flow: failed to get tenant integrations');
      common.sendHTTPError(res, {
        error: 'failed to get CxEngage tenant integrations',
      }, 500);
      return;
    }

    const integrations = integrationRes.body;
    logger.debug('/init-psr-flow: integrations: ', integrations);

    // Get the active XMS services integration
    const sfIntegration = common.getIntegration('xms', integrations, sfOrganizationId);
    logger.debug('/init-psr-flow: sfIntegration: ', sfIntegration);

    if (!sfIntegration) {
      logger.error('/init-psr-flow: XMS services integration not found for the provided organisation id');
      common.sendHTTPError(res, {
        error: 'XMS services integration not found for the provided organisation id',
      }, 500);
      return;
    }

    if (!sfIntegration.active) {
      logger.error('/init-psr-flow: xms integration is not active');
      common.sendHTTPError(res, {
        error: 'error, XMS services integration is not active',
      }, 500);
      return;
    }

    const sfProperties = sfIntegration.properties;
    logger.debug('/init-psr-flow: sfProperties: ', sfProperties);

    // -------------------------------------------------------------------------------------
    // #4 ----------------------------------------------------------------------------------

    // --------------------------------------------------------------------------
    // xms voice call
    logger.debug('/init-psr-flow: Generating VoiceCall...');

    // For now we are using private key as hardcoded and not the "sfProperties.certificate"
    const voiceCallRes = await sfRequests.postVoiceCall(
      extensionType,
      sfProperties,
      interactionDetails.contactPoint,
      interactionDetails.customer,
      interactionId,
      transfer,
      outboundTransfer,
    );
    logger.debug('/init-psr-flow: Generating VoiceCall voiceCallRes:', voiceCallRes);

    if (voiceCallRes.status > errors.STATUS_NO_ERROR) {
      logger.error('/init-psr-flow: failed to create xms voice call record');
      common.sendHTTPError(res, {
        error: 'failed to create xms voice call record',
      }, 500);
      return;
    }

    if (voiceCallRes.body.errors.length > 0) {
      logger.error('/init-psr-flow: error received while creating xms voice call record');
      common.sendHTTPError(res, {
        error: 'error received while creating xms voice call record',
      }, 500);
      return;
    }

    const sfVoiceCallId = voiceCallRes.body.voiceCallId;
    logger.debug(`/init-psr-flow: Done Getting VoiceCallId: ${sfVoiceCallId}`);

    // -------------------------------------------------------------------------------------
    // #5 ----------------------------------------------------------------------------------

    // --------------------------------------------------------------------------
    // Get the PSR
    logger.debug('/init-psr-flow: Getting PSR....');

    let psrDetails = null;
    for (let index = 0; index < SF_GET_PSR_RETRY_COUNT; index += 1) {
      logger.debug(`/init-psr-flow: Get PSR Retry count: ${index}`);

      const getPsrRes = await sfRequests.getPSRRequest(sfProperties, sfVoiceCallId);
      logger.debug('/init-psr-flow: Get PSR getPsrRes: ', getPsrRes);
      if (getPsrRes.status === errors.STATUS_NO_ERROR) {
        if (getPsrRes.body.done && getPsrRes.body.records.length > 0) {
          // eslint-disable-next-line prefer-destructuring
          psrDetails = getPsrRes.body.records[0];
          break;
        }
      }
      await wait(SF_GET_PSR_RETRY_DELAY_MS);
    }
    logger.debug('/init-psr-flow: Got PSR Object: ', psrDetails);

    if (!psrDetails) {
      logger.error('/init-psr-flow: failed to get routing request from XMS services');
      common.sendHTTPError(res, {
        error: 'failed to get routing request from XMS services',
      }, 500);
      return;
    }

    logger.debug('/init-psr-flow: Done Getting PSR....');

    // -------------------------------------------------------------------------------------
    // #6 ----------------------------------------------------------------------------------

    // --------------------------------------------------------------------------
    // Create Agent Work
    logger.debug('/init-psr-flow: Creating AgentWork....');

    const getPsrRes = await sfRequests.createAgentWork(
      sfProperties,
      psrDetails.ServiceChannelId,
      sfVoiceCallId,
      sfUserId,
      psrDetails.Id,
    );
    logger.debug('/init-psr-flow: Creating AgentWork getPsrRes:', getPsrRes);

    if (getPsrRes.status > errors.STATUS_NO_ERROR) {
      logger.error('/init-psr-flow: failed to create xms agent work record');
      common.sendHTTPError(res, {
        error: 'failed to create xms agent work record',
      }, 500);
      return;
    }

    logger.debug('/init-psr-flow: Done AgentWork.... Done ALL');
  } catch (error) {
    logger.error('/init-psr-flow: Catch Error: ', error);
    common.sendHTTPError(res, {
      error: 'failed to perform xms PSR flow, internal error',
    }, 500);
    return;
  }

  // -------------------------------------------------------
  // Done --------------------------------------------------
  common.sendHTTPSuccess(res, {
    status: 200,
    message: 'success, xms PSR flow',
  });
});

/**
 * Sleep function
 * @param {Int} milliseconds to wait for
 * @returns Promise
 */
function wait(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

module.exports = router;
