const express = require('express');

const errors = require('../utils/errors');
const common = require('../utils/common');
const cxRequests = require('../utils/cxengage-requests');
const logger = require('../utils/logger');

const router = express.Router();

/* POST sf-enabled-tenants API */
// eslint-disable-next-line no-unused-vars
router.post('/users/:userId/xms/sf-enabled-tenants', async (req, res, next) => {
  try {
    const {
      headers,
      method,
      url,
      params,
      body,
    } = req;

    logger.debug('/sf-enabled-tenants: headers:', headers);
    logger.debug('/sf-enabled-tenants: method:', method);
    logger.debug('/sf-enabled-tenants: params:', params);
    logger.debug('/sf-enabled-tenants: url:', url);
    logger.debug('/sf-enabled-tenants: body:', body);

    //------------------------------------------------------------
    // Validate input values

    if (!Object.prototype.hasOwnProperty.call(req.params, 'userId')) {
      logger.error('/sf-enabled-tenants: parameter user id is missing');
      common.sendHTTPError(res, {
        error: 'parameter user id is missing',
      });
      return;
    }

    // Get user-id from the path url
    const { userId: cxUserId } = req.params;
    logger.debug(`/sf-enabled-tenants: extractParam: cxUserId: ${cxUserId}`);

    if (!Object.prototype.hasOwnProperty.call(req.body, 'tenants')) {
      logger.error('/sf-enabled-tenants: parameter tenants is missing');
      common.sendHTTPError(res, {
        error: 'parameter tenants is missing',
      });
      return;
    }

    const { tenants } = req.body;
    if (!tenants || tenants.length <= 0) {
      logger.error('/sf-enabled-tenants: parameter tenants list is empty missing');
      common.sendHTTPError(res, {
        error: 'parameter tenant list is empty or invalid',
      });
      return;
    }

    //------------------------------------------------------------
    // Validate input values
    const sfEnabledTenants = [];

    // Loop over tenants
    for (let index = 0; index < tenants.length; index += 1) {
      // Validate the 'tenants' object for required properties
      if (!Object.prototype.hasOwnProperty.call(tenants[index], 'tenantId')) {
        logger.error('/sf-enabled-tenants: parameter tenants is missing in array of tenants');
        common.sendHTTPError(res, {
          error: 'parameter tenant id is missing in tenants array',
        });
        return;
      }

      if (!Object.prototype.hasOwnProperty.call(tenants[index], 'tenantName')) {
        logger.error('/sf-enabled-tenants: parameter tenant name is missing in array of tenants');
        common.sendHTTPError(res, {
          error: 'parameter tenant name is missing in tenants array',
        });
        return;
      }

      const { tenantId } = tenants[index];
      if (tenantId) {
        if (!common.validateUUID(tenantId)) {
          logger.error('/sf-enabled-tenants: invalid CX tenant id');
          common.sendHTTPError(res, {
            error: 'invalid tenant id',
          });
          return;
        }

        // Check if user is part of tenant
        const userPath = `tenants/${tenantId}/users/${cxUserId}`;
        const userRes = await cxRequests.getRequest(userPath);
        logger.debug('/sf-enabled-tenants: getRequest: userRes: ', userRes);
        if (userRes.status > errors.STATUS_NO_ERROR) {
          logger.error('/sf-enabled-tenants: invalid CX user');
          common.sendHTTPError(res, {
            error: 'invalid user',
          });
          return;
        }
        const userDetails = userRes.body;

        // Check if user is enabled for tenant
        let userEnabled = false;
        if (userDetails.platformStatus === 'enabled'
          && userDetails.status === 'accepted') {
          userEnabled = true;
        }

        logger.debug('/sf-enabled-tenants: userEnabled:', userEnabled);

        if (userEnabled) {
          // Get the tenant, check if tenant is enabled
          const tenantPath = `tenants/${tenantId}`;
          const tenantRes = await cxRequests.getRequest(tenantPath);
          if (tenantRes.status > errors.STATUS_NO_ERROR) {
            logger.error('/sf-enabled-tenants: failed to get tenant details tenantId:', tenantId);
            common.sendHTTPError(res, {
              error: 'failed to get tenant details',
            });
            return;
          }

          // Tenant must be active
          if (tenantRes.body.active) {
            // Get the tenant integrations
            const integrationsPath = `tenants/${tenantId}/integrations`;
            const integrationRes = await cxRequests.getRequest(integrationsPath);
            if (integrationRes.status > errors.STATUS_NO_ERROR) {
              logger.error('/sf-enabled-tenants: failed to get integration details tenantId:', tenantId);
              common.sendHTTPError(res, {
                error: 'failed to get integration details',
              });
              return;
            }

            // Check if SF integration is available and active
            for (let iIndex = 0; iIndex < integrationRes.body.length; iIndex += 1) {
              if (integrationRes.body[iIndex].type === 'xms') {
                if (integrationRes.body[iIndex].active) {
                  // Add tenant to valid tenant list
                  sfEnabledTenants.push(tenants[index]);
                  break;
                }
              }
            }
          }
        }
      }
    } // End of for

    // -------------------------------------------------------
    // Done --------------------------------------------------
    common.sendHTTPSuccess(res, sfEnabledTenants);
  } catch (error) {
    logger.error('/sf-enabled-tenants: Catch Error: ', error);
    common.sendHTTPError(res, {
      error: 'failed to get tenants, internal error',
    }, 500);
  }
});

module.exports = router;
