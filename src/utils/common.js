const { spawn } = require('child_process');

const logger = require('./logger');

/**
 * Method to send HTTP error response
 *
 * @param {Object} res Express http response object
 * @param {String} body Payload in form of json object
 * @param {Number} errorCode HTTP status code default 400 bad request
 *
 * @returns
 * HTTP response object with status and payload
 */
function sendHTTPError(res, body, errorCode = 400) {
  const jsonStr = JSON.stringify({
    result: {
      ...body,
    },
  });

  res.statusCode = errorCode;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Length', jsonStr.length);
  res.write(jsonStr);
  res.end();
}

/**
 * Method to send HTTP success response
 *
 * @param {Object} res Express http response object
 * @param {String} body Payload in form of json object
 * @param {Number} status HTTP status code, default 200
 *
 * @returns
 * HTTP response object with status and payload
 */
function sendHTTPSuccess(res, body, status = 200) {
  const jsonStr = JSON.stringify({
    result: body,
  });

  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Length', jsonStr.length);
  res.write(jsonStr);
  res.end();
}

/**
 * Validate UUID
 *
 * @param {String} uuid UUID to validate
 * @returns True if provided UUID is value, else false
 */
function validateUUID(uuid) {
  if (!uuid || uuid.length <= 0) {
    return false;
  }
  // eslint-disable-next-line prefer-regex-literals
  const pattern = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$', 'i');
  return pattern.test(uuid);
}

/**
 * Extract the path params such as /v1/tenants/<id>/user/<id>
 * extracting id of the tenant or user
 *
 * @param {string} path http path after the /v1/
 * @param {string} param param to extract from the path
 *
 * @returns extracted param
 */
function extractParam(path, param) {
  if (!path || path.length <= 0) {
    return null;
  }

  if (!param || param.length <= 0) {
    return null;
  }

  const start = path.indexOf(param) + param.length + 1;
  if (start < 0) {
    return null;
  }

  let end = path.indexOf('/', start);
  if (end < 0) {
    end = path.length;
  }

  const extract = path.slice(start, end);
  return extract;
}

/**
 * Get XMS services integration from array of integration
 * based on integration type and the SF organisation id
 *
 * @param {string} integrationType Type of the integration
 * @param {Array} integrations Array of integration
 * @param {string} sfOrganizationId SF organization id
 *
 * @returns SF integration object
 */
function getIntegration(integrationType, integrations, sfOrganizationId) {
  for (let index = 0; index < integrations.length; index += 1) {
    if (integrations[index].type === integrationType) {
      const sfIntegration = integrations[index];
      const { properties } = sfIntegration;
      if (Object.prototype.hasOwnProperty.call(properties, 'organisationId')) {
        if (properties.organisationId === sfOrganizationId) {
          return sfIntegration;
        }
      }
    }
  }
  // We did not find any xms integration with provided organisation id
  return null;
}

/**
 * Execute shell command
 *
 * @param {string} command shell command to execute
 * @param {Array} args Arguments for the shell command as array of strings
 * @returns
 */
async function execShellCommand(command, args) {
  return new Promise((resolve, reject) => {
    let result = '';
    // Execute the shell command
    const promise = spawn(command, args, { shell: true });
    promise.stdout.on('data', (data) => {
      logger.debug('Common: execShellCommand: on stdout:', data.toString());
      result += data.toString();
    });
    promise.stderr.on('data', (data) => {
      logger.error('Common: execShellCommand: on stderr:', data.toString());
      reject(new Error({
        status: 1,
        body: {
          message: 'failed',
        },
      }));
    });
    promise.on('close', (data) => {
      logger.debug('Common: execShellCommand: on close:', data);
      resolve({
        status: 0,
        body: {
          result,
          message: 'success',
        },
      });
    });
  });
}

module.exports = {
  sendHTTPError,
  sendHTTPSuccess,
  validateUUID,
  extractParam,
  getIntegration,
  execShellCommand,
};
