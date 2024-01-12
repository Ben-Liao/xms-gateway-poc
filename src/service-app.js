const express = require('express');

const statusRouter = require('./routes/status');

// If post is not configured we default to 8080
const SERVICE_PORT = process.env.SERVICE_PORT || 8080;

// Create service app, app that supports service cloud gateway APIs
const serviceApp = express();
serviceApp.use(express.json());
serviceApp.use(express.urlencoded({ extended: false }));
serviceApp.set('port', SERVICE_PORT);

// -------------------------------------------
// Add Routes
serviceApp.use('/', statusRouter); // Status for 8080

// -------------------------------------------
serviceApp.use((req, res) => {
  res.status(404).send({
    error: 'path not found',
  });
});

module.exports = serviceApp;
