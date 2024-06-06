const express = require('express');

const logger = require('../utils/logger');
const common = require('../utils/common');
const actions = require('../handlers/actions');

const router = express.Router({ mergeParams: true });

// eslint-disable-next-line no-unused-vars
router.post('/tenants/:tenantId/interactions/:interactionId/actions/verify-credentials', async (req, res, next) => {
  logger.info('/verify-credentials: called: ', req);

  common.sendHTTPSuccess(res, {
    status: 200,
    message: 'verify-credentials Done',
  });
});

router.post('/tenants/:tenantId/interactions/:interactionId/actions/dial', actions.dial);
router.post('/tenants/:tenantId/interactions/:interactionId/actions/play-media', actions.playMedia);
router.post('/tenants/:tenantId/interactions/:interactionId/actions/:actionName', actions.modifyCall);

module.exports = router;
