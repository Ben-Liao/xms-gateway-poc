const cors = require('cors');
const express = require('express');

// Routes
const initPsrFlowRouter = require('./consumers/init-psr-flow');
const sfEnabledTenantsRouter = require('./consumers/sf-enabled-tenants');
const sfUpdateVoiceCallRecRouter = require('./consumers/update-voice-call-record');
const gatewaysRouter = require('./consumers/gateways');
const statusRouter = require('./consumers/status');
const webhookRouter = require('./consumers/webhook');

// If post is not configured we default to 9080
const PUBLIC_PORT = process.env.PUBLIC_PORT || 9080;

// Create public app, app that supports health status request
const publicApp = express();
publicApp.use(express.json());
publicApp.use(express.urlencoded({ extended: false }));
publicApp.use(cors()); // only enabled for public routes
publicApp.set('port', PUBLIC_PORT);

// -------------------------------------------
// Add Routes
publicApp.use('/', statusRouter); // Status for 9080

// APIs provided by the gateway service
publicApp.use('/v1', initPsrFlowRouter);
publicApp.use('/v1', sfEnabledTenantsRouter);
publicApp.use('/v1', sfUpdateVoiceCallRecRouter);
publicApp.use('/', gatewaysRouter);
publicApp.use('/', webhookRouter);

// -------------------------------------------
publicApp.use((req, res) => {
  res.status(404).send({
    error: 'path not found',
  });
});

module.exports = publicApp;
