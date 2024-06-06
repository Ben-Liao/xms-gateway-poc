const express = require('express');

const state = require('../state');
const logger = require('../utils/logger');

const router = express.Router();

router.get('/status', async (req, res) => {
  logger.debug('POST: /status req received');
  const appState = state.getAppState();
  if (!appState) {
    return res.status(500).send({
      body: {
        message: 'status - invalid app state',
      },
    });
  }

  return res.status(appState.state).send(
    {
      body: appState.body,
    },
  );
});

router.get('/healthcheck', async (req, res) => {
  logger.debug('POST: /healthcheck req received');
  const appState = state.getAppState();
  if (!appState) {
    return res.status(500).send({
      body: {
        message: 'healthcheck - invalid app state',
      },
    });
  }

  return res.status(appState.state).send(
    {
      body: appState.body,
    },
  );
});

module.exports = router;
